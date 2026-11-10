"use client";

import { heroServiceLabels } from "@/data/hero-orbit";

type HeroServiceLabelsProps = {
  /** Shown below the hero breakpoint (the compact hero) instead of above it. */
  compact?: boolean;
};

export function HeroServiceLabels({ compact = false }: HeroServiceLabelsProps) {
  const loop = [...heroServiceLabels, ...heroServiceLabels];

  return (
    <div
      className={`hero-rail pointer-events-none relative h-[245px] w-[141px] flex-col overflow-hidden bg-black ${compact ? "flex shrink-0" : "hidden hero:flex"}`}
      aria-hidden="true"
    >
      <div className="hero-label-marquee flex flex-col items-end gap-2.5">
        {loop.map((label, index) => (
          <div
            key={`${label}-${index}`}
            className="inline-flex whitespace-nowrap rounded-[6px] border border-white/26 px-4 py-2.5 text-base leading-none text-[#fdfcfc]"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(#000,transparent_50%,#000)]" />
    </div>
  );
}
