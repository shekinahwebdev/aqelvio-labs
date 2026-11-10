"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { focusTarget, goToTarget, takeFocusOnArrival } from "@/lib/in-page";
import { recordPath } from "@/lib/route-history";
import { scrollToElement } from "@/lib/smooth-scroll";

/**
 * Same-page hash links (the skip link, `#section` anchors). A native fragment
 * jump adds a history entry the App Router has no state for, so Back from
 * the next page would change the URL without rendering this page again.
 * Instead the entry is added through Next's patched `pushState`, the target
 * is scrolled below the sticky header (gliding for pointer clicks, instant
 * for keyboard) and focus moves to it, as a native jump would for Tab order.
 * Next `<Link>`s handle themselves and arrive here already prevented.
 */
export function InPageLinks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = event
        .composedPath()
        .find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement);
      if (!link?.hash || link.target === "_blank" || link.hasAttribute("download")) {
        return;
      }

      const url = new URL(link.href);
      const { location } = window;
      if (
        url.origin !== location.origin ||
        url.pathname !== location.pathname ||
        url.search !== location.search
      ) {
        return;
      }

      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) {
        return;
      }

      event.preventDefault();
      /* Keyboard activation fires a click with detail 0. */
      goToTarget(target, { immediate: event.detail === 0 });

      /* Next patches both to copy its router state onto the entry. Re-using
         the current hash replaces, as a native jump to it would. */
      if (url.hash === location.hash) {
        window.history.replaceState(null, "", url.hash);
      } else {
        window.history.pushState(null, "", url.hash);
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  /*
   * Arriving on a page with a hash (a direct load, or a link such as
   * /services#logo-design): the browser's own jump happens before the page
   * has settled (fonts, sticky and pinned sections), so it lands in the
   * wrong place. Once settled, place the target below the header again.
   */
  const pathname = usePathname();
  useEffect(() => {
    recordPath(pathname);
    /* Arrived by a link that asked for it (the footer): start focus here. */
    if (takeFocusOnArrival()) {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = (id && document.getElementById(id)) || document.getElementById("main-content");
      if (target) focusTarget(target);
    }
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    let timers: number[] = [];
    const place = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (!cancelled && target) scrollToElement(target, { immediate: true });
    };
    const settle = () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers = [window.setTimeout(place, 0), window.setTimeout(place, 450)];
    };
    if (window.location.hash) {
      settle();
      document.fonts?.ready.then(() => window.setTimeout(place, 60));
    }
    /* A hash typed or changed in the address bar on the same page. */
    window.addEventListener("hashchange", settle);
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("hashchange", settle);
    };
  }, [pathname]);

  return null;
}
