import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { collections, getCollection } from "@/lib/books";

const bandBg: Record<string, string> = {
  "bear-professional": "#F6ECFF",
  "bold-easy": "#FFF3C4",
  "comfy-seasons": "#FFDCE1",
};

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const c = getCollection(collection);
  return { title: c ? `${c.name} — Cozy Colouring` : "Collection" };
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const c = getCollection(collection);
  if (!c) notFound();

  const bg = bandBg[c.slug] ?? "#F6ECFF";

  return (
    <PageShell>
      <section className="relative border-b-2 border-ink-strong" style={{ background: bg }}>
        <div className="mx-auto max-w-container px-6 py-16">
          <Link href="/collections" className="text-sm font-bold text-ink underline underline-offset-4">
            ← All collections
          </Link>
          <div className="mt-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-ink">Collection</p>
              <h1 className="mt-2 text-5xl font-extrabold text-ink-strong md:text-6xl">{c.name}</h1>
            </div>
            <span className="rounded-pill border-2 border-ink-strong bg-white px-4 py-2 text-sm font-extrabold text-ink-strong">
              Cozy Collection
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-container px-6 py-16">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {c.books.map((b) => (
            <Link
              key={b.id}
              href={`/collections/${c.slug}/${b.slug}`}
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
              <h2 className="mt-3 text-lg font-extrabold text-ink">{b.title}</h2>
              <p className="text-sm text-muted">
                {b.pageCount > 0 ? "Preview pages inside" : "Coming soon"}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
