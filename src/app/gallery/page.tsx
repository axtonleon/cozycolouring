import { PageShell } from "@/components/PageShell";
import { GalleryGrid } from "@/components/GalleryGrid";
import { collections } from "@/lib/books";

export const metadata = { title: "Gallery — Cozy Colouring" };

export default function GalleryPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden border-b-2 border-ink-strong bg-lavender">
        <div className="mx-auto max-w-container px-6 py-16 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-ink-strong">The gallery</p>
          <h1 className="mt-3 text-5xl font-extrabold text-ink-strong md:text-6xl">
            Every page. All in one place.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink">
            Browse colouring pages from across the collections. Tap any page for a closer look.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-container px-6 py-10">
        <GalleryGrid collections={collections} />
      </section>
    </PageShell>
  );
}
