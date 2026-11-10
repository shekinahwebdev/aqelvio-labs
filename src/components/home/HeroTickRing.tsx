import {
  heroTickLines,
  heroTickRingViewBox,
} from "@/data/hero-tick-geometry";

type HeroTickRingProps = {
  className?: string;
};

export function HeroTickRing({ className }: HeroTickRingProps) {
  return (
    <svg viewBox={heroTickRingViewBox} className={className} aria-hidden="true">
      {heroTickLines.map((tick, index) => (
        <line
          key={index}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
