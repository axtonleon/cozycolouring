"use client";

import { useState } from "react";

const STROKE = "#2C2C2C";
const SW = 6;

export function ColoringMascot() {
  const [key, setKey] = useState(0);

  return (
    <div className="relative">
      <div className="absolute -inset-8 -z-10 rotate-[-3deg] rounded-[40px] bg-white/70 shadow-card" />
      <div className="absolute -inset-8 -z-10 rotate-[2deg] rounded-[40px] bg-[#FFF3C4]/70 shadow-card" />

      <div className="relative overflow-hidden rounded-[32px] border-2 border-ink-strong bg-white p-6 shadow-hover">
        <svg
          key={key}
          viewBox="0 0 360 380"
          role="img"
          aria-label="A chubby frog holding a tulip, being coloured in"
          className="mx-auto block h-auto w-full max-w-md"
        >
          <defs>
            <mask id="paintReveal" maskUnits="userSpaceOnUse" x="0" y="0" width="360" height="380">
              <rect x="0" y="0" width="360" height="380" fill="black" />
              <rect x="0" y="380" width="360" height="0" fill="white">
                <animate
                  attributeName="y"
                  from="380"
                  to="0"
                  dur="1.8s"
                  begin="0.35s"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.16 1 0.3 1"
                />
                <animate
                  attributeName="height"
                  from="0"
                  to="380"
                  dur="1.8s"
                  begin="0.35s"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.16 1 0.3 1"
                />
              </rect>
            </mask>
          </defs>

          {/* Colour layer — masked reveal */}
          <g mask="url(#paintReveal)">
            {/* body */}
            <ellipse cx="180" cy="230" rx="130" ry="120" fill="#8FD48A" />
            {/* belly */}
            <ellipse cx="180" cy="270" rx="82" ry="70" fill="#EAF6D8" />
            {/* feet */}
            <ellipse cx="90" cy="330" rx="40" ry="22" fill="#8FD48A" />
            <ellipse cx="270" cy="330" rx="40" ry="22" fill="#8FD48A" />
            {/* eye whites */}
            <ellipse cx="130" cy="150" rx="34" ry="38" fill="#FFFFFF" />
            <ellipse cx="230" cy="150" rx="34" ry="38" fill="#FFFFFF" />
            {/* pupils */}
            <circle cx="134" cy="156" r="13" fill="#2C2C2C" />
            <circle cx="234" cy="156" r="13" fill="#2C2C2C" />
            {/* pupil highlights */}
            <circle cx="139" cy="151" r="4" fill="#FFFFFF" />
            <circle cx="239" cy="151" r="4" fill="#FFFFFF" />
            {/* cheeks */}
            <ellipse cx="90" cy="215" rx="16" ry="10" fill="#FFB1C1" />
            <ellipse cx="270" cy="215" rx="16" ry="10" fill="#FFB1C1" />
            {/* tulip flower */}
            <path d="M180 300 q-14 -22 0 -46 q14 24 0 46z" fill="#F27AA0" />
            <path d="M180 254 q-14 -6 -18 14 q10 -2 18 -4 z" fill="#E95C88" />
            <path d="M180 254 q14 -6 18 14 q-10 -2 -18 -4 z" fill="#E95C88" />
            {/* stem */}
            <path d="M180 300 q0 20 6 40" stroke="#4E8C4A" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M186 320 q10 -4 16 -14" stroke="#4E8C4A" strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>

          {/* Outline layer — always visible */}
          <g fill="none" stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round">
            <ellipse cx="180" cy="230" rx="130" ry="120" />
            <ellipse cx="180" cy="270" rx="82" ry="70" />
            <ellipse cx="90" cy="330" rx="40" ry="22" />
            <ellipse cx="270" cy="330" rx="40" ry="22" />
            <ellipse cx="130" cy="150" rx="34" ry="38" />
            <ellipse cx="230" cy="150" rx="34" ry="38" />
            <circle cx="134" cy="156" r="13" fill={STROKE} />
            <circle cx="234" cy="156" r="13" fill={STROKE} />
            {/* mouth */}
            <path d="M150 210 q30 22 60 0" />
            {/* tulip petals */}
            <path d="M180 300 q-14 -22 0 -46 q14 24 0 46z" />
            <path d="M180 254 q-14 -6 -18 14 q10 -2 18 -4 z" />
            <path d="M180 254 q14 -6 18 14 q-10 -2 -18 -4 z" />
            <path d="M180 300 q0 20 6 40" />
            <path d="M186 320 q10 -4 16 -14" />
          </g>
        </svg>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-muted">Watch her come to life →</p>
          <button
            onClick={() => setKey((k) => k + 1)}
            className="rounded-pill border-2 border-ink-strong bg-[#FFE27A] px-4 py-2 text-sm font-extrabold text-ink-strong transition hover:-translate-y-0.5 hover:shadow-card"
          >
            Colour again
          </button>
        </div>
      </div>
    </div>
  );
}
