import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FFFEFE",
        "bg-alt": "#FFFAF7",
        surface: "#F7F7F7",
        lavender: { DEFAULT: "#F6ECFF", 2: "#F8EDFF" },
        ink: "#3C3C3C",
        "ink-strong": "#322F37",
        muted: "#868686",
        subtle: "#ACACAC",
        sale: "#E95144",
        success: "#428445",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      borderRadius: { pill: "999px" },
      boxShadow: {
        card: "0 2px 12px rgba(50, 47, 55, 0.06)",
        hover: "0 6px 20px rgba(50, 47, 55, 0.10)",
      },
      maxWidth: { container: "1320px" },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) rotate(-4deg)" },
          "50%": { transform: "translate(10px, -8px) rotate(4deg)" },
        },
        wobble: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        colorSweep: {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        paintSweep: {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        "float-slow": "float 7s ease-in-out infinite",
        drift: "drift 6s ease-in-out infinite",
        wobble: "wobble 4s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        pop: "pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "color-sweep": "colorSweep 1.4s ease-out 0.3s both",
      },
    },
  },
} satisfies Config;
