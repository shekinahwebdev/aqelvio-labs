"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import { scrollToElement } from "@/lib/smooth-scroll";

/**
 * Scroll `target` below the sticky header (through Lenis where active;
 * immediately for keyboard activation or reduced motion) and move focus to
 * it, as a native jump would. A non-interactive target is made focusable
 * only while it holds focus, and draws no focus ring.
 */
export function goToTarget(target: HTMLElement, { immediate = false }: { immediate?: boolean } = {}) {
  scrollToElement(target, { immediate });
  focusTarget(target);
}

/** Move focus to `target` without scrolling (see goToTarget). */
export function focusTarget(target: HTMLElement) {
  if (target.tabIndex < 0 && !target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
    target.style.outline = "none";
    target.addEventListener(
      "blur",
      () => {
        target.removeAttribute("tabindex");
        target.style.removeProperty("outline");
      },
      { once: true },
    );
  }
  target.focus({ preventScroll: true });
}

/*
 * After a link moves the visitor to another page, focus should start on
 * that page (its #section, or the main content), not stay on the link that
 * is still in the shared layout. Set on click, used once the new route has
 * rendered (InPageLinks).
 */
let focusOnArrival = false;

export function requestFocusOnArrival() {
  focusOnArrival = true;
}

export function takeFocusOnArrival(): boolean {
  const pending = focusOnArrival;
  focusOnArrival = false;
  return pending;
}

/**
 * For a link's onClick: when it points at the page already showing, stay
 * here instead of navigating: scroll to its #section, or to the top of the
 * page (the main content) when it has none. Plain left clicks only, so
 * Cmd/Ctrl/Shift/Alt-clicks and middle clicks keep the browser's behaviour.
 * Returns true when it handled the click (and prevented navigation).
 */
export function stayOnSamePage(event: ReactMouseEvent<HTMLAnchorElement>): boolean {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.currentTarget.target === "_blank"
  ) {
    return false;
  }

  const url = new URL(event.currentTarget.href);
  const { location } = window;
  if (url.origin !== location.origin) return false;
  if (url.pathname !== location.pathname || url.search !== location.search) {
    /* Another page: Next navigates; focus follows once it has rendered. */
    requestFocusOnArrival();
    return false;
  }

  const target = url.hash
    ? document.getElementById(decodeURIComponent(url.hash.slice(1)))
    : document.getElementById("main-content");
  if (!target) return false;

  event.preventDefault();
  /* Keyboard activation fires a click with detail 0: jump, don't glide. */
  goToTarget(target, { immediate: event.detail === 0 });

  /* No new history entry for the same page. Next patches replaceState to
     carry its router state onto the entry. */
  const next = url.hash || location.pathname + location.search;
  if (url.hash && url.hash !== location.hash) window.history.pushState(null, "", url.hash);
  else if (next !== location.pathname + location.search + location.hash) window.history.replaceState(null, "", next);
  return true;
}
