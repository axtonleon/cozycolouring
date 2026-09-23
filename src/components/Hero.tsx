import Image from "next/image";
import Link from "next/link";
import { FloatingDoodles } from "./FloatingDoodles";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-lavender via-lavender-2 to-bg">
      <FloatingDoodles />

      <div className="relative mx-auto grid max-w-container items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="animate-pop">
          <span className="inline-flex items-center gap-2 rounded-pill bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink-strong shadow-card">
            <span className="inline-block h-2 w-2 rounded-full bg-sale" />
            New drop · Bear Professional
          </span>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] text-ink-strong md:text-6xl lg:text-7xl">
            Color your{" "}
            <span className="relative inline-block">
              <span className="relative z-10">cozy</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-0 h-4 bg-[#FFE27A] md:h-5"
                style={{ borderRadius: "999px" }}
              />
            </span>{" "}
            away.
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink">
            Hand-drawn coloring books for calm moments, slow evenings, and the little pockets of comfort in between.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/books"
              className="rounded-pill bg-ink-strong px-7 py-3.5 text-base font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-hover"
            >
              Browse books
            </Link>
            <Link
              href="/gallery"
              className="rounded-pill border-2 border-ink-strong bg-white px-7 py-3.5 text-base font-bold text-ink-strong transition hover:-translate-y-0.5 hover:bg-lavender"
            >
              See the gallery
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-5 text-sm text-muted">
            <div className="flex -space-x-2">
              <span className="h-8 w-8 rounded-full border-2 border-white bg-[#FFB1C1]" />
              <span className="h-8 w-8 rounded-full border-2 border-white bg-[#C9B6FF]" />
              <span className="h-8 w-8 rounded-full border-2 border-white bg-[#FFE27A]" />
              <span className="h-8 w-8 rounded-full border-2 border-white bg-[#A8E6CF]" />
            </div>
            <span>Loved by <b className="text-ink">10,000+</b> cozy colorers</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 -z-10 rotate-[-3deg] rounded-[40px] bg-white/60 shadow-card md:rotate-[-4deg]" />
          <div className="absolute -inset-8 -z-10 rotate-[2deg] rounded-[40px] bg-[#FFF3C4]/70 shadow-card" />
          <div className="relative overflow-hidden rounded-[32px] bg-white shadow-hover">
            <Image
              src="/illustrations/hero-01.png"
              alt="Cozy animals sharing a picnic"
              width={1246}
              height={666}
              priority
              className="h-auto w-full"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden animate-wobble md:block">
            <Image
              src="/illustrations/mascot-02.png"
              alt=""
              width={140}
              height={140}
              className="drop-shadow-[0_10px_15px_rgba(50,47,55,0.15)]"
            />
          </div>
          <div className="absolute -right-6 -top-6 hidden animate-float md:block">
            <Image
              src="/illustrations/mascot-01.png"
              alt=""
              width={130}
              height={130}
              className="drop-shadow-[0_10px_15px_rgba(50,47,55,0.15)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
