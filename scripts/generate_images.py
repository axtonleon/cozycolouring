"""
Generate all site illustrations via Gemini's image model (Nano Banana).

Usage:
    pip install google-genai python-dotenv pillow
    # Put GEMINI_API_KEY=... in .env at the project root
    py -3 scripts/generate_images.py
    py -3 scripts/generate_images.py --only hero-01 mascot-03
    py -3 scripts/generate_images.py --variants 4
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

ROOT = Path(__file__).resolve().parent.parent
PROMPTS_FILE = ROOT / "scripts" / "prompts.json"
OUTPUT_DIR = ROOT / "public" / "illustrations"
MODEL = "gemini-2.5-flash-image"


def load_prompts() -> dict:
    with PROMPTS_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


def build_full_prompt(style: str, scene: str, aspect: str) -> str:
    return (
        f"{style}\n\nScene: {scene}\n\n"
        f"Aspect ratio: {aspect}. "
        "Output a single high-quality illustration."
    )


def generate_one(client, prompt: str, aspect: str):
    return client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
            image_config=types.ImageConfig(aspect_ratio=aspect),
        ),
    )


def save_response(response, out_path: Path) -> bool:
    for part in response.candidates[0].content.parts:
        if getattr(part, "inline_data", None) and part.inline_data.data:
            out_path.write_bytes(part.inline_data.data)
            return True
    return False


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", nargs="*", help="Generate only these image ids.")
    parser.add_argument("--variants", type=int, default=1, help="Variants per prompt.")
    parser.add_argument("--skip-existing", action="store_true", help="Skip files that already exist.")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY missing. Copy .env.example to .env and fill it in.", file=sys.stderr)
        return 1

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    data = load_prompts()
    style = data["style"]
    images = data["images"]
    if args.only:
        wanted = set(args.only)
        images = [i for i in images if i["id"] in wanted]
        if not images:
            print(f"No matching ids for: {args.only}", file=sys.stderr)
            return 1

    client = genai.Client(api_key=api_key)

    total = len(images) * args.variants
    done = 0
    failed = []

    for item in images:
        prompt = build_full_prompt(style, item["scene"], item["aspect"])
        for v in range(1, args.variants + 1):
            suffix = "" if args.variants == 1 else f"-v{v}"
            out_path = OUTPUT_DIR / f"{item['id']}{suffix}.png"
            done += 1

            if args.skip_existing and out_path.exists():
                print(f"[{done}/{total}] skip {out_path.name} (exists)")
                continue

            print(f"[{done}/{total}] generating {out_path.name} ({item['aspect']})...")
            try:
                response = generate_one(client, prompt, item["aspect"])
                if save_response(response, out_path):
                    print(f"           saved -> {out_path}")
                else:
                    print(f"           WARNING: no image in response for {item['id']}")
                    failed.append(item["id"])
            except Exception as e:
                print(f"           ERROR {item['id']}: {e}")
                failed.append(item["id"])

            time.sleep(1.2)

    print("\nDone.")
    if failed:
        print(f"Failed ({len(failed)}): {', '.join(failed)}")
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
