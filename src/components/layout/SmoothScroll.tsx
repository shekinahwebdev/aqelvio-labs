"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { SMOOTH_SCROLL } from "@/config/smooth-scroll";
import { setLenis } from "@/lib/smooth-scroll";

/**
 * Page-level smooth scrolling. Mounted once in the root layout, so it
 * survives client-side navigation. Lenis is only created for fine-pointer
 * devices without a reduced-motion preference; touch and reduced motion get
 * native scrolling. Lenis runs on GSAP's ticker so the page has a single
 * animation loop.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia(SMOOTH_SCROLL.query);
    let lenis: Lenis | null = null;
    let detach: (() => void) | null = null;

    const enable = () => {
      if (lenis) {
        return;
      }

      const instance = new Lenis({
        lerp: SMOOTH_SCROLL.lerp,
        wheelMultiplier: SMOOTH_SCROLL.wheelMultiplier,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        stopInertiaOnNavigate: true,
      });

      /*
       * Lenis scrolls the real window, so ScrollTrigger needs no proxy; this
       * keeps every scrubbed trigger in step with Lenis on the same frame.
       */
      gsap.registerPlugin(ScrollTrigger);
      instance.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);

      /*
       * Lenis watches <html> for size changes, but `html.h-full` pins it to
       * the viewport, so a taller page (e.g. after client-side navigation)
       * would keep the old scroll limit. <body> grows with the content.
       */
      const bodyObserver = new ResizeObserver(() => instance.resize());
      bodyObserver.observe(document.body);

      detach = () => {
        bodyObserver.disconnect();
        gsap.ticker.remove(tick);
        instance.destroy();
      };
      lenis = instance;
      setLenis(instance);
    };

    const disable = () => {
      detach?.();
      detach = null;
      lenis = null;
      setLenis(null);
    };

    const sync = () => (query.matches ? enable() : disable());

    sync();
    query.addEventListener("change", sync);

    return () => {
      query.removeEventListener("change", sync);
      disable();
    };
  }, []);

  return null;
}
