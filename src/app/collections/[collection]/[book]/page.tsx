import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { collections, getBook, getCollection } from "@/lib/books";
import { PRICE_NGN, formatNaira } from "@/lib/pricing";
import { BuyForm } from "@/components/BuyForm";

export function generateStaticParams() {
  return collections.flatMap((c) =>
    c.books.map((b) => ({ collection: c.slug, book: b.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string; book: string }> }) {
  const { collection, book } = await params;
  const b = getBook(collection, book);
  return { title: b ? `${b.title} — Cozy Colouring` : "Book" };
}

export default async function BookPage({ params }: { params: Promise<{ collection: string; book: string }> }) {
  const { collection, book } = await params;
  const c = getCollection(collection);
  const b = getBook(collection, book);
  if (!c || !b) notFound();

  const related = c.books.filter((x) => x.slug !== b.slug).slice(0, 4);

  return (
    <PageShell>
      <section className="mx-auto max-w-container px-6 py-10">
        <nav className="text-sm text-muted">
          <Link href="/collections" className="hover:underline">Collections</Link>
          {" / "}
          <Link href={`/collections/${c.slug}`} className="hover:underline">{c.name}</Link>
          {" / "}
          <span className="text-ink">{b.title}</span>
        </nav>
      </section>

      <section className="mx-auto max-w-container px-6 pb-16">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rotate-[-3deg] rounded-3xl bg-lavender" />
            <div className="absolute -inset-4 -z-10 rotate-[2deg] rounded-3xl bg-[#FFF3C4]/70" />
            {b.cover && (
              <div className="overflow-hidden rounded-2xl border-2 border-ink-strong bg-white shadow-hover">
                <Image
                  src={b.cover}
                  alt={b.title}
                  width={800}
                  height={1000}
                  priority
                  className="h-auto w-full"
                />
              </div>
            )}
          </div>

          <div>
            <Link href={`/collections/${c.slug}`} className="text-sm font-bold uppercase tracking-widest text-muted">
              {c.name}
            </Link>
            <h1 className="mt-2 text-5xl font-extrabold text-ink-strong">{b.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-pill bg-[#FFE27A] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink-strong">Ages 8+</span>
              <span className="rounded-pill bg-lavender px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink-strong">Bold &amp; Easy</span>
              <span className="rounded-pill bg-[#EAF6D8] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink-strong">Original</span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-ink-strong">{formatNaira(PRICE_NGN)}</span>
              <span className="text-sm text-muted">free shipping in Lagos</span>
            </div>

            <p className="mt-6 text-lg text-ink">
              Unique {b.title} pages ready for you. Bold, thick outlines. Original artwork drawn from scratch. Made for slow, stress-free coloring.
            </p>

            <ul className="mt-6 space-y-2 text-ink">
              <li className="flex items-center gap-3"><Dot /> Unique {b.title} pages</li>
              <li className="flex items-center gap-3"><Dot /> Thick, bold outlines</li>
              <li className="flex items-center gap-3"><Dot /> Ideal for markers, pens &amp; pencils</li>
              <li className="flex items-center gap-3"><Dot /> Single-sided printing</li>
              <li className="flex items-center gap-3"><Dot /> Original pages</li>
              <li className="flex items-center gap-3"><Dot /> Stress-relieving</li>
            </ul>

            <div className="mt-8">
              <BuyForm collectionSlug={c.slug} bookSlug={b.slug} />
            </div>
          </div>
        </div>
      </section>

      {b.pages.length > 0 && (
        <section className="border-t-2 border-ink-strong bg-bg-alt py-16">
          <div className="mx-auto max-w-container px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted">Peek inside</p>
                <h2 className="mt-2 text-3xl font-extrabold text-ink-strong md:text-4xl">Sample pages</h2>
              </div>
              <span className="text-sm text-muted">Tap any page to see it larger</span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {b.pages.map((src, i) => (
                <div
                  key={src}
                  className="overflow-hidden rounded-xl border-2 border-ink-strong bg-white transition hover:-translate-y-1 hover:shadow-hover"
                >
                  <Image
                    src={src}
                    alt={`${b.title} preview page ${i + 1}`}
                    width={400}
                    height={520}
                    className="h-auto w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-container px-6 py-16">
          <h2 className="mb-8 text-3xl font-extrabold text-ink-strong">More from {c.name}</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((r) => (
              <Link key={r.id} href={`/collections/${c.slug}/${r.slug}`} className="group">
                <div className="overflow-hidden rounded-2xl border-2 border-ink-strong bg-white transition group-hover:-translate-y-1 group-hover:shadow-hover">
                  {r.cover && (
                    <Image src={r.cover} alt={r.title} width={400} height={500} className="h-auto w-full" />
                  )}
                </div>
                <h3 className="mt-3 text-base font-extrabold text-ink">{r.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}

function Dot() {
  return <span className="inline-block h-2 w-2 rounded-full bg-ink-strong" />;
}
