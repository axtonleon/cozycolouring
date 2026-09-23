"""
Scan collections/ and emit data/books.json for the site to consume.

Each book gets: id, slug, title, collection, coverPath, pages[], pageCount.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "public"
COLLECTIONS_DIR = PUBLIC_DIR / "collections"
OUT_FILE = ROOT / "data" / "books.json"


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def rel(p: Path) -> str:
    from urllib.parse import quote
    return "/" + quote(p.relative_to(PUBLIC_DIR).as_posix())


def find_cover(book_dir: Path) -> Path | None:
    covers = [f for f in book_dir.glob("*.png") if "cover" in f.stem.lower()]
    if covers:
        return sorted(covers, key=lambda p: len(p.stem))[0]
    return None


def find_pages(book_dir: Path, cover: Path | None) -> list[Path]:
    return sorted(
        f for f in book_dir.glob("*.png")
        if f != cover and "cover" not in f.stem.lower()
    )


def main() -> int:
    if not COLLECTIONS_DIR.exists():
        print(f"missing {COLLECTIONS_DIR}", file=sys.stderr)
        return 1

    collections = []
    for coll_dir in sorted(COLLECTIONS_DIR.iterdir()):
        if not coll_dir.is_dir():
            continue
        coll_name = coll_dir.name
        books = []
        for book_dir in sorted(coll_dir.iterdir()):
            if not book_dir.is_dir():
                continue
            cover = find_cover(book_dir)
            pages = find_pages(book_dir, cover)
            book_slug = slugify(book_dir.name)
            books.append({
                "id": f"{slugify(coll_name)}--{book_slug}",
                "slug": book_slug,
                "title": book_dir.name,
                "collection": coll_name,
                "collectionSlug": slugify(coll_name),
                "cover": rel(cover) if cover else None,
                "pages": [rel(p) for p in pages],
                "pageCount": len(pages),
            })
        collections.append({
            "slug": slugify(coll_name),
            "name": coll_name,
            "bookCount": len(books),
            "books": books,
        })

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(json.dumps({"collections": collections}, indent=2), encoding="utf-8")

    total_books = sum(c["bookCount"] for c in collections)
    missing_cover = sum(1 for c in collections for b in c["books"] if not b["cover"])
    print(f"Wrote {OUT_FILE.relative_to(ROOT)}")
    print(f"  {len(collections)} collections, {total_books} books")
    if missing_cover:
        print(f"  WARNING: {missing_cover} book(s) missing a cover")
    return 0


if __name__ == "__main__":
    sys.exit(main())
