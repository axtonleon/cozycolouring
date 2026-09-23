"""
Detect and crop the black frame border from generated illustrations.

Safety:
- Only crops when a clear frame is detected on that side.
- Scan cap: 8% of image dimension. If we hit that without finding non-border,
  we assume there is no frame there and leave the side alone.
- Originals are backed up to public/illustrations/_originals/ on first run.

Usage:
    py -3 scripts/crop_borders.py --dry-run   # print what would be cropped
    py -3 scripts/crop_borders.py             # actually crop
"""

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "public" / "illustrations"
BACKUP_DIR = IMG_DIR / "_originals"

BORDER_DARK_THRESHOLD = 90      # pixel is "dark" if max(R,G,B) < this
BORDER_ROW_RATIO = 0.75         # row is "border" if >= 75% dark pixels
MAX_SCAN_RATIO = 0.15           # scan up to 15% of dimension to find the frame
MIN_TRIM = 3                    # ignore trims smaller than this
SAFETY_INSET = 2                # extra px trimmed after border ends


def is_dark(pixel: tuple) -> bool:
    r, g, b = pixel[:3]
    return max(r, g, b) < BORDER_DARK_THRESHOLD


def row_dark_ratio(img: Image.Image, y: int) -> float:
    w = img.width
    px = img.load()
    dark = sum(1 for x in range(w) if is_dark(px[x, y]))
    return dark / w


def col_dark_ratio(img: Image.Image, x: int) -> float:
    h = img.height
    px = img.load()
    dark = sum(1 for y in range(h) if is_dark(px[x, y]))
    return dark / h


def scan_side(size: int, dark_ratio_at) -> int:
    """
    Walk inward from index 0 up to size*MAX_SCAN_RATIO.
    Skip leading non-border. Find border block. Return index of first
    non-border row/col AFTER the border block ends. If no border found, return 0.
    """
    cap = int(size * MAX_SCAN_RATIO)
    in_border = False
    for i in range(cap):
        is_border = dark_ratio_at(i) >= BORDER_ROW_RATIO
        if is_border:
            in_border = True
        elif in_border:
            return i
    return 0


def find_border(img: Image.Image) -> tuple:
    w, h = img.size

    top = scan_side(h, lambda y: row_dark_ratio(img, y))
    bottom_trim = scan_side(h, lambda y: row_dark_ratio(img, h - 1 - y))
    left = scan_side(w, lambda x: col_dark_ratio(img, x))
    right_trim = scan_side(w, lambda x: col_dark_ratio(img, w - 1 - x))

    top = top + SAFETY_INSET if top >= MIN_TRIM else 0
    left = left + SAFETY_INSET if left >= MIN_TRIM else 0
    bottom = h - (bottom_trim + SAFETY_INSET) if bottom_trim >= MIN_TRIM else h
    right = w - (right_trim + SAFETY_INSET) if right_trim >= MIN_TRIM else w

    return left, top, right, bottom


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    files = sorted(IMG_DIR.glob("*.png"))
    if not files:
        print(f"No PNGs in {IMG_DIR}")
        return 1

    if not args.dry_run:
        BACKUP_DIR.mkdir(exist_ok=True)

    print(f"{'file':<28} {'orig':>12}  {'crop':>12}  {'trim (L T R B)':>20}")
    print("-" * 80)

    total_trimmed = 0
    for f in files:
        if f.parent.name == "_originals":
            continue
        with Image.open(f) as im:
            im = im.convert("RGB")
            w, h = im.size
            left, top, right, bottom = find_border(im)
            cw, ch = right - left, bottom - top
            trim = (left, top, w - right, h - bottom)
            trimmed_any = any(trim)
            marker = "  " if trimmed_any else " ~"
            print(f"{marker}{f.name:<26} {w}x{h:<6}  {cw}x{ch:<6}  {trim}")

            if trimmed_any and not args.dry_run:
                backup = BACKUP_DIR / f.name
                if not backup.exists():
                    shutil.copy2(f, backup)
                im.crop((left, top, right, bottom)).save(f)
                total_trimmed += 1

    if args.dry_run:
        print("\n(dry run) no files written. Re-run without --dry-run to apply.")
    else:
        print(f"\nCropped {total_trimmed} file(s). Originals in {BACKUP_DIR}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
