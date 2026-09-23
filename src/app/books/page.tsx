import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { collections, allBooks } from "@/lib/books";

export const metadata = { title: "All books — Cozy Colouring" };

export default function BooksIndex() {
  return (
    <PageShell>
      <section className="mx-auto max-w-container px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-widest text-muted">The whole library</p>
        <h1 className="mt-2 text-5xl font-extrabold text-ink-strong">All books</h1>
        <p className="mt-3 max-w-xl text-lg text-ink">
          {allBooks.length} hand-drawn coloring books across {collections.length} cozy collections.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {collections.map((c) => (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              className="rounded-pill border-2 border-ink-strong bg-white px-4 py-2 text-sm font-bold text-ink-strong hover:bg-lavender"
            >
              {c.name} · {c.bookCount}
            </a>
          ))}
        </div>
      </section>

      {collections.map((c) => (
        <section key={c.slug} id={c.slug} className="mx-auto max-w-container px-6 pb-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-3xl font-extrabold text-ink-strong">{c.name}</h2>
            <Link href={`/collections/${c.slug}`} className="text-sm font-bold text-ink-strong underline underline-offset-4">
              View collection →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {c.books.map((b) => (
              <Link key={b.id} href={`/collections/${c.slug}/${b.slug}`} className="group">
                <div className="overflow-hidden rounded-2xl border-2 border-ink-strong bg-white transition group-hover:-translate-y-1 group-hover:shadow-hover">
                  {b.cover && (
                    <Image src={b.cover} alt={b.title} width={400} height={500} className="h-auto w-full" />
                  )}
                </div>
                <h3 className="mt-3 text-lg font-extrabold text-ink">{b.title}</h3>
                <p className="text-sm text-muted">{c.name}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
