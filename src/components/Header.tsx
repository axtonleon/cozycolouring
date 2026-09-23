"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/collections", label: "Collections" },
  { href: "/books", label: "Books" },
  { href: "/gallery", label: "Gallery" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-lavender/60 bg-lavender/85 backdrop-blur">
      <nav className="mx-auto flex max-w-container items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-ink-strong md:text-xl">
          <span className="inline-block h-8 w-8 rounded-full bg-white shadow-card">
            <span className="block h-full w-full rounded-full border-[3px] border-ink-strong bg-[#FFE27A]" />
          </span>
          Cozy Colouring
        </Link>

        <div className="hidden items-center gap-7 text-[15px] font-semibold text-ink md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-ink-strong">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/books"
            className="hidden rounded-pill bg-ink-strong px-5 py-2.5 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-hover md:inline-block"
          >
            Shop books
          </Link>
          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-pill border-2 border-ink-strong bg-white text-ink-strong md:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div
            className="absolute inset-0 bg-ink-strong/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            className="animate-[slideIn_0.25s_ease-out] absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col border-l-2 border-ink-strong bg-lavender-2"
            role="dialog"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between border-b-2 border-ink-strong px-5 py-4">
              <span className="text-lg font-extrabold text-ink-strong">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-pill border-2 border-ink-strong bg-white text-xl font-bold text-ink-strong"
              >
                ×
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-5">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl border-2 border-transparent bg-white/70 px-5 py-4 text-lg font-extrabold text-ink-strong transition hover:border-ink-strong hover:bg-white"
                >
                  {l.label}
                  <span aria-hidden>→</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t-2 border-ink-strong bg-lavender p-5">
              <Link
                href="/books"
                onClick={() => setOpen(false)}
                className="block w-full rounded-pill bg-ink-strong px-5 py-3.5 text-center text-base font-bold text-white shadow-card"
              >
                Shop books
              </Link>
              <p className="mt-4 text-center text-sm text-ink">Made slowly, with love.</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
