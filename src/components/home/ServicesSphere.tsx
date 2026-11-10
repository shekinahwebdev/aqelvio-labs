"use client";

import { useEffect, useId, useRef } from "react";

/*
 * Decorative shaded sphere with two orbital rings (original artwork).
 *
 * Motion follows the reference's services shape, which is scroll-linked
 * only (nothing runs on a timer): as the shape scrolls into view it grows
 * from half size, travels up-right by half its width into place, and the
 * rings turn 280°. Progress runs from 15% to 50% of the shape's passage
 * through the viewport, as measured on the reference at 390–1440px.
 * Only the rings rotate, so the sphere's light stays fixed.
 *
 * `--p` (0–1) drives everything from CSS (see globals.css). It defaults to
 * 1, the settled state, which is what reduced motion and no-JS show.
 * Scroll is only listened to while the shape is near the viewport.
 *
 * Wrappers: the outer element is placed by the caller (className) and is
 * never transformed — progress is measured from it; the inner one carries
 * the animated transform.
 */
const START = 0.15;
const END = 0.5;

export function ServicesSphere({ className = "" }: { className?: string }) {
  const placeRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const place = placeRef.current;
    const motion = motionRef.current;
    if (!place || !motion) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let listening = false;
    let inView = false;

    const update = () => {
      frame = 0;
      const rect = place.getBoundingClientRect();
      const vh = window.innerHeight;
      const passageAt = (top: number) => (vh - top) / (vh + rect.height);
      /* Finish by the end of the page if it ends before the reference range does. */
      const maxScroll = document.documentElement.scrollHeight - vh;
      const end = Math.min(END, passageAt(rect.top - (maxScroll - window.scrollY)));
      const p = end <= START ? 1 : (passageAt(rect.top) - START) / (end - START);
      motion.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      const method = on ? "addEventListener" : "removeEventListener";
      window[method]("scroll", schedule, { passive: true });
      window[method]("resize", schedule);
    };
    const sync = () => {
      if (reduce.matches) {
        listen(false);
        motion.style.removeProperty("--p");
        return;
      }
      listen(inView);
      update();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "25% 0px" },
    );
    observer.observe(place);
    reduce.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      reduce.removeEventListener("change", sync);
      listen(false);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={placeRef} aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <div ref={motionRef} className="services-sphere size-full">
        <svg viewBox="0 0 200 200" className="size-full overflow-visible" focusable="false">
          <defs>
            <radialGradient id={`${id}-body`} cx="0.36" cy="0.3" r="0.78">
              <stop offset="0" stopColor="#57585d" />
              <stop offset="0.45" stopColor="#2f3033" />
              <stop offset="1" stopColor="#151517" />
            </radialGradient>
            <radialGradient id={`${id}-rim`} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.78" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
            </radialGradient>
            <linearGradient id={`${id}-ring-a`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id={`${id}-ring-b`} x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0.24" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.03" />
            </linearGradient>
          </defs>

          <circle cx="100" cy="100" r="82" fill={`url(#${id}-body)`} fillOpacity="0.88" />
          <circle cx="100" cy="100" r="82" fill={`url(#${id}-rim)`} />
          <circle
            cx="100"
            cy="100"
            r="81.5"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.07"
            vectorEffect="non-scaling-stroke"
          />

          <g className="services-sphere-rings" fill="none" strokeWidth="1.25">
            <ellipse
              cx="100"
              cy="100"
              rx="98"
              ry="46"
              transform="rotate(-16 100 100)"
              stroke={`url(#${id}-ring-a)`}
              vectorEffect="non-scaling-stroke"
            />
            <ellipse
              cx="100"
              cy="100"
              rx="97"
              ry="38"
              transform="rotate(64 100 100)"
              stroke={`url(#${id}-ring-b)`}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
