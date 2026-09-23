import Image from "next/image";
import Link from "next/link";
import { collections } from "@/lib/books";

const palette = [
  { bg: "#F6ECFF", ring: "#C9B6FF" },
  { bg: "#FFF3C4", ring: "#FFE27A" },
  { bg: "#FFDCE1", ring: "#FFB1C1" },
];

export function CollectionShowcase() {
  return (
    <section className="mx-auto max-w-container px-6 py-24">
      <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-muted">Explore</p>
          <h2 className="mt-2 text-4xl font-extrabold text-ink-strong md:text-5xl">
            Pick your cozy corner
          </h2>
          <p className="mt-3 max-w-xl text-lg text-ink">
            Three collections, one calm afternoon. Every book is drawn by hand.
          </p>
        </div>
        <Link href="/collections" className="text-sm font-bold text-ink-strong underline underline-offset-4">
          See all →
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {collections.map((c, i) => {
          const p = palette[i % palette.length];
          const covers = c.books.slice(0, 3);
          return (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group relative overflow-hidden rounded-3xl p-8 shadow-card transition hover:-translate-y-1 hover:shadow-hover"
              style={{ background: p.bg }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="rounded-pill bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-strong"
                >
                  {c.bookCount} books
                </span>
                <span className="text-2xl transition group-hover:translate-x-1">→</span>
              </div>
              <h3 className="mt-6 text-3xl font-extrabold text-ink-strong">{c.name}</h3>

              <div className="relative mt-8 flex h-56 items-end justify-center">
                {covers.map((b, j) => {
                  const rotate = [-8, 0, 8][j];
                  const z = j === 1 ? 10 : 5;
                  const translate = [-40, 0, 40][j];
                  return (
                    <div
                      key={b.id}
                      className="absolute bottom-0 transition-all duration-300 group-hover:translate-y-[-6px]"
                      style={{
                        transform: `translateX(${translate}px) rotate(${rotate}deg)`,
                        zIndex: z,
                      }}
                    >
                      {b.cover && (
                        <div
                          className="overflow-hidden rounded-lg border-2 border-ink-strong bg-white shadow-hover"
                          style={{ width: 130, height: 165 }}
                        >
                          <Image
                            src={b.cover}
                            alt={b.title}
                            width={260}
                            height={330}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
