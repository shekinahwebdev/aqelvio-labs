"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const MOTION = "(prefers-reduced-motion: no-preference)";

/*
 * Scroll reveals for /pricing, as on the project pages: each [data-pr-in]
 * block un-blurs, fades and rises once as it enters. Content is in place
 * without JS; with reduced motion nothing moves. A block that receives
 * keyboard focus before it has appeared is completed at once.
 */
export function PricingReveal({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const tweens = new Map<Element, gsap.core.Tween>();
      root.querySelectorAll<HTMLElement>("[data-pr-in]").forEach((el) => {
        tweens.set(
          el,
          gsap.from(el, {
            opacity: 0,
            filter: "blur(14px)",
            y: 28,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "filter",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }),
        );
      });
      const onFocus = (event: FocusEvent) => {
        const block = (event.target as HTMLElement).closest("[data-pr-in]");
        if (block) tweens.get(block)?.progress(1);
      };
      root.addEventListener("focusin", onFocus);
      return () => root.removeEventListener("focusin", onFocus);
    });
    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());
    /* Opening a <details> changes the page height. */
    const onToggle = () => ScrollTrigger.refresh();
    root.addEventListener("toggle", onToggle, true);
    return () => {
      alive = false;
      root.removeEventListener("toggle", onToggle, true);
      mm.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="pr">
      {children}
    </div>
  );
}
