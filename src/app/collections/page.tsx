import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { collections } from "@/lib/books";

const palette = [
  { bg: "#F6ECFF" },
  { bg: "#FFF3C4" },
  { bg: "#FFDCE1" },
];

export const metadata = { title: "Collections — Cozy Colouring" };

export default function CollectionsIndex() {
  return (
    <PageShell>
      <section className="mx-auto max-w-container px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-widest text-muted">Browse</p>
        <h1 className="mt-2 text-5xl font-extrabold text-ink-strong">All collections</h1>
        <p className="mt-3 max-w-xl text-lg text-ink">
          Three cozy little worlds. Pick one and settle in.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {collections.map((c, i) => {
            const p = palette[i % palette.length];
            const covers = c.books.slice(0, 3);
            return (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="group relative overflow-hidden rounded-3xl border-2 border-ink-strong p-8 shadow-card transition hover:-translate-y-1 hover:shadow-hover"
                style={{ background: p.bg }}
              >
                <span className="rounded-pill bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-strong">
                  {c.bookCount} books
                </span>
                <h2 className="mt-6 text-3xl font-extrabold text-ink-strong">{c.name}</h2>
                <div className="relative mt-8 flex h-52 items-end justify-center">
                  {covers.map((b, j) => {
                    const rotate = [-8, 0, 8][j];
                    const translate = [-40, 0, 40][j];
                    const z = j === 1 ? 10 : 5;
                    return (
                      <div
                        key={b.id}
                        className="absolute bottom-0"
                        style={{
                          transform: `translateX(${translate}px) rotate(${rotate}deg)`,
                          zIndex: z,
                        }}
                      >
                        {b.cover && (
                          <div
                            className="overflow-hidden rounded-lg border-2 border-ink-strong bg-white"
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
    </PageShell>
  );
}
