const TICK_COUNT = 120;
const VIEW = 360;
const CENTER = VIEW / 2;
const TICK_OUTER = 178;
const TICK_INNER = 171.5;

/** Fixed-precision coords so SSR and client SVG attributes match exactly. */
function formatCoord(value: number): string {
  return value.toFixed(2);
}

export type HeroTickLine = {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
};

export const heroTickRingViewBox = `0 0 ${VIEW} ${VIEW}`;

/** Ticks start at 12 o'clock and run clockwise (reveal order). */
export const heroTickLines: HeroTickLine[] = Array.from(
  { length: TICK_COUNT },
  (_, index) => {
    const angle = (index / TICK_COUNT) * Math.PI * 2 - Math.PI / 2;

    return {
      x1: formatCoord(CENTER + Math.cos(angle) * TICK_INNER),
      y1: formatCoord(CENTER + Math.sin(angle) * TICK_INNER),
      x2: formatCoord(CENTER + Math.cos(angle) * TICK_OUTER),
      y2: formatCoord(CENTER + Math.sin(angle) * TICK_OUTER),
    };
  },
);
