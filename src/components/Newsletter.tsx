import Image from "next/image";

export function Newsletter() {
  return (
    <section className="relative mx-auto max-w-container px-6 py-24">
      <div className="relative overflow-hidden rounded-[36px] border-2 border-ink-strong bg-lavender p-10 md:p-16">
        <div className="pointer-events-none absolute -bottom-6 -right-6 hidden w-56 rotate-6 md:block">
          <Image src="/illustrations/mascot-03.png" alt="" width={240} height={240} />
        </div>

        <div className="relative max-w-lg">
          <p className="text-sm font-bold uppercase tracking-widest text-ink-strong">The cozy letter</p>
          <h2 className="mt-3 text-4xl font-extrabold text-ink-strong md:text-5xl">
            One free page.<br />Every month.
          </h2>
          <p className="mt-4 text-lg text-ink">
            Join the mailing list and we'll send updates on new books straight to your inbox. No spam. Just calm.
          </p>
          <form className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 rounded-pill border-2 border-ink-strong bg-white px-5 py-3 text-base text-ink placeholder:text-subtle focus:outline-none focus:ring-4 focus:ring-[#C9B6FF]"
            />
            <button
              type="submit"
              className="rounded-pill bg-ink-strong px-6 py-3 text-base font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-hover"
            >
              Send me the page
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
