import Image from "next/image";
import Link from "next/link";
import { allBooks } from "@/lib/books";

function pickRandom<T>(arr: T[], n: number): T[] {
  const pool = [...arr];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

export function FeaturedBooks() {
  const books = pickRandom(allBooks, 8);
  return (
    <section className="bg-bg-alt py-24">
      <div className="mx-auto max-w-container px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted">Fresh off the crayon</p>
            <h2 className="mt-2 text-4xl font-extrabold text-ink-strong md:text-5xl">Featured books</h2>
          </div>
          <Link href="/books" className="text-sm font-bold text-ink-strong underline underline-offset-4">
            All books →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {books.map((b) => (
            <Link
              key={b.id}
              href={`/collections/${b.collectionSlug}/${b.slug}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl border-2 border-ink-strong bg-white transition group-hover:-translate-y-1 group-hover:shadow-hover">
                {b.cover && (
                  <Image
                    src={b.cover}
                    alt={b.title}
                    width={400}
                    height={500}
                    className="h-auto w-full transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="mt-3 text-[18px] font-extrabold text-ink">{b.title}</h3>
              <p className="text-sm text-muted">{b.collection}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
