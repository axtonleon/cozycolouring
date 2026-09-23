const Heart = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className}>
    <path
      d="M20 34s-13-7.5-13-17a7 7 0 0 1 13-3.6A7 7 0 0 1 33 17c0 9.5-13 17-13 17z"
      fill="#FFB1C1"
      stroke="#2C2C2C"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

const Star = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className}>
    <path
      d="M20 4l4 12h12l-10 7 4 12-10-7-10 7 4-12L4 16h12z"
      fill="#FFE27A"
      stroke="#2C2C2C"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

const Sparkle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className}>
    <path
      d="M20 4c1 8 8 15 16 16-8 1-15 8-16 16-1-8-8-15-16-16 8-1 15-8 16-16z"
      fill="#C9B6FF"
      stroke="#2C2C2C"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

export function FloatingDoodles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Heart className="absolute left-[6%] top-[14%] w-10 animate-float" />
      <Sparkle className="absolute left-[12%] top-[62%] w-8 animate-drift" />
      <Star className="absolute right-[8%] top-[20%] w-12 animate-float-slow" />
      <Heart className="absolute right-[14%] top-[70%] w-8 animate-drift" />
      <Sparkle className="absolute left-[42%] top-[6%] w-6 animate-wobble" />
      <Star className="absolute right-[38%] top-[85%] w-7 animate-float" />
    </div>
  );
}
