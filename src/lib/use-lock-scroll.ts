"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/smooth-scroll";

export function useLockScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    /* Halt smooth-scroll inertia first so the captured position is final. */
    getLenis()?.stop();

    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      htmlOverflow: documentElement.style.overflow,
    };

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    /* The fixed body already stops page scrolling. Where the styled page
       scrollbar is always shown (globals.css), keep it so nothing shifts. */
    if (getComputedStyle(documentElement).overflowY !== "scroll") {
      documentElement.style.overflow = "hidden";
    }

    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      documentElement.style.overflow = previous.htmlOverflow;
      /* Instant: `html { scroll-behavior: smooth }` would otherwise animate
         the restore from the top of the page. */
      window.scrollTo({ top: scrollY, behavior: "instant" });
      getLenis()?.start();
    };
  }, [locked]);
}
