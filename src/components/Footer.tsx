import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bg-lavender">
      <div className="mx-auto max-w-container px-6 pt-20 pb-10 text-center">
        <p className="text-4xl font-extrabold text-ink-strong">
          Made slowly<span className="text-sale">.</span> With love<span className="text-sale">.</span>
        </p>
        <p className="mx-auto mt-3 max-w-md text-ink">
          Every page drawn by hand. Every book packed with care.
        </p>
      </div>
      <div className="border-t-2 border-ink-strong bg-lavender-2">
        <div className="mx-auto grid max-w-container gap-10 px-6 py-14 md:grid-cols-4">
          <div>
            <div className="text-xl font-extrabold text-ink-strong">Cozy Colouring</div>
            <p className="mt-3 text-sm text-ink">
              Hand-drawn coloring books to bring calm, warmth, and creativity into your day.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-ink-strong">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-ink">
              <li><Link href="/collections">Collections</Link></li>
              <li><Link href="/books">All books</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-ink-strong">Info</h4>
            <ul className="mt-4 space-y-2 text-sm text-ink">
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-ink-strong">Say hi</h4>
            <p className="mt-4 text-sm text-ink">care@cozycolouring.com</p>
            <div className="mt-4 flex gap-3 text-lg">
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink-strong bg-white">ig</span>
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink-strong bg-white">tt</span>
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink-strong bg-white">pt</span>
            </div>
          </div>
        </div>
        <div className="border-t border-ink-strong/10 py-5 text-center text-xs text-ink">
          © {new Date().getFullYear()} Cozy Colouring · made slowly, with love
        </div>
      </div>
    </footer>
  );
}
