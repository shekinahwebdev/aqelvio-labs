"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { claimAudio, pauseAllMedia } from "@/lib/media-playback";

/*
 * The site-wide half of the playback policy (see media-playback.ts):
 * one audible player at a time, and everything pauses on a route change
 * (links and Back/Forward), when the tab is hidden and when the page is
 * left. Rendered once, in the root layout.
 */
export function MediaGuard() {
  const pathname = usePathname();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    /* Effects run once the new route has committed, before any of its
       previews start (they wait for an IntersectionObserver callback). */
    pauseAllMedia();
  }, [pathname]);

  useEffect(() => {
    /* `play` and `volumechange` do not bubble; listen in the capture phase. */
    const onAudible = (event: Event) => {
      if (event.target instanceof HTMLMediaElement) claimAudio(event.target);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") pauseAllMedia();
    };
    const onLeave = () => pauseAllMedia();

    document.addEventListener("play", onAudible, true);
    document.addEventListener("volumechange", onAudible, true);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onLeave);
    return () => {
      document.removeEventListener("play", onAudible, true);
      document.removeEventListener("volumechange", onAudible, true);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onLeave);
    };
  }, []);

  return null;
}
