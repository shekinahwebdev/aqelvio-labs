/**
 * Desktop wheel smoothing, matched to the Qubix reference (Webflow IX3
 * smooth scroll). Profiled in Chrome at 1440×900 with real wheel input:
 * one 100-unit tick travels 150px (native: 100px) and eases out
 * exponentially — 50% at ~184ms, 90% at ~484ms, settled by ~950ms —
 * which is a per-frame lerp of ~0.08 at 60fps.
 */
export const SMOOTH_SCROLL = {
  lerp: 0.08,
  wheelMultiplier: 1.5,
  /** Smoothing only where a precise pointer drives a wheel; touch stays native. */
  query:
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
} as const;
