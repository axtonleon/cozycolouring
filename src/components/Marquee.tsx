const items = [
  "original",
  "cozy vibes",
  "print + digital",
  "made with love",
  "stress-free colouring",
  "cute animals",
  "warm palettes",
  "slow evenings",
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="border-y-2 border-ink-strong bg-[#FFE27A] py-4">
      <div className="flex overflow-hidden">
        <div className="flex shrink-0 animate-marquee gap-10 pr-10 text-lg font-extrabold text-ink-strong">
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              {t}
              <span aria-hidden className="text-2xl">✿</span>
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 animate-marquee gap-10 pr-10 text-lg font-extrabold text-ink-strong"
        >
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              {t}
              <span className="text-2xl">✿</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
