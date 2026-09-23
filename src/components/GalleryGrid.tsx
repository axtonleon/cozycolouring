"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import type { Collection } from "@/lib/books";

interface Item {
  src: string;
  bookTitle: string;
  collection: string;
  collectionSlug: string;
  bookSlug: string;
}

export function GalleryGrid({ collections }: { collections: Collection[] }) {
  const items: Item[] = useMemo(
    () =>
      collections.flatMap((c) =>
        c.books.flatMap((b) =>
          b.pages.map((src) => ({
            src,
            bookTitle: b.title,
            collection: c.name,
            collectionSlug: c.slug,
            bookSlug: b.slug,
          }))
        )
      ),
    [collections]
  );

  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<Item | null>(null);

  const filtered = filter === "all" ? items : items.filter((i) => i.collectionSlug === filter);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <>
      <div className="sticky top-[68px] z-30 -mx-6 mb-8 border-b border-ink-strong/10 bg-bg/90 px-6 py-4 backdrop-blur">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            All · {items.length}
          </FilterChip>
          {collections.map((c) => {
            const count = items.filter((i) => i.collectionSlug === c.slug).length;
            return (
              <FilterChip
                key={c.slug}
                active={filter === c.slug}
                onClick={() => setFilter(c.slug)}
              >
                {c.name} · {count}
              </FilterChip>
            );
          })}
        </div>
      </div>

      <div className="columns-2 gap-4 md:columns-3 lg:columns-4 xl:columns-5 [&>*]:mb-4">
        {filtered.map((item, i) => (
          <button
            key={item.src + i}
            onClick={() => setActive(item)}
            className="group relative block w-full overflow-hidden rounded-2xl border-2 border-ink-strong bg-white transition hover:-translate-y-1 hover:shadow-hover"
          >
            <Image
              src={item.src}
              alt={`${item.bookTitle} page`}
              width={500}
              height={640}
              className="h-auto w-full transition duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
              <div className="text-left text-white">
                <div className="text-sm font-extrabold">{item.bookTitle}</div>
                <div className="text-xs opacity-90">{item.collection}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-strong/85 p-4 backdrop-blur-sm animate-pop"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border-2 border-ink-strong bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={`${active.bookTitle} page`}
              width={1000}
              height={1300}
              className="h-auto max-h-[85vh] w-auto object-contain"
            />
            <div className="flex items-center justify-between gap-4 border-t-2 border-ink-strong bg-bg-alt px-5 py-3">
              <div>
                <div className="text-sm font-extrabold text-ink-strong">{active.bookTitle}</div>
                <div className="text-xs text-muted">{active.collection}</div>
              </div>
              <a
                href={`/collections/${active.collectionSlug}/${active.bookSlug}`}
                className="rounded-pill bg-ink-strong px-4 py-2 text-sm font-bold text-white hover:-translate-y-0.5"
              >
                View book →
              </a>
            </div>
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border-2 border-ink-strong bg-white text-lg font-bold text-ink-strong hover:bg-lavender"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-pill border-2 border-ink-strong px-4 py-2 text-sm font-extrabold transition ${
        active ? "bg-ink-strong text-white" : "bg-white text-ink-strong hover:bg-lavender"
      }`}
    >
      {children}
    </button>
  );
}
