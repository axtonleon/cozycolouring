import Image from "next/image";
import { allBooks } from "@/lib/books";

export function PeekInside() {
  const pages = allBooks
    .filter((b) => b.pages.length > 0)
    .flatMap((b) => b.pages.slice(0, 1))
    .slice(0, 6);

  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-container px-6">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-muted">Peek inside</p>
          <h2 className="mt-2 text-4xl font-extrabold text-ink-strong md:text-5xl">
            Every page starts blank.<br />You bring the colour.
          </h2>
        </div>

        <div className="relative">
          <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:hidden">
            {pages.map((src, i) => (
              <div key={i} className="shrink-0 snap-center">
                <div className="overflow-hidden rounded-xl border-2 border-ink-strong bg-white shadow-card">
                  <Image
                    src={src}
                    alt="Colouring page preview"
                    width={220}
                    height={280}
                    className="h-52 w-40 object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="hidden justify-center md:flex">
            <div className="flex -space-x-12">
              {pages.map((src, i) => {
                const rotate = [-8, 4, -3, 6, -5, 3][i] ?? 0;
                return (
                  <div
                    key={i}
                    className="animate-pop"
                    style={{
                      animationDelay: `${i * 80}ms`,
                      transform: `rotate(${rotate}deg)`,
                      zIndex: i,
                    }}
                  >
                    <div className="overflow-hidden rounded-xl border-2 border-ink-strong bg-white shadow-hover">
                      <Image
                        src={src}
                        alt="Colouring page preview"
                        width={220}
                        height={280}
                        className="h-56 w-44 object-cover"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-lg text-center text-ink">
          Line-art thick enough for pencils, markers, and messy fun.
        </p>
      </div>
    </section>
  );
}
