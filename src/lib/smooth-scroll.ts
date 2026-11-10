import type Lenis from "lenis";

/** The single page-level Lenis instance, or null when scrolling is native. */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** The sticky header overlaps whatever we scroll to. */
function headerOffset(): number {
  return document.querySelector("header")?.getBoundingClientRect().height ?? 0;
}

/**
 * Scroll so `target` sits just below the sticky header — through Lenis on
 * desktop, natively (smooth unless reduced motion is preferred) elsewhere.
 * (Lenis's own element targeting is not used: it measures transformed
 * positions.)
 * `immediate` jumps without animating (keyboard activation).
 */
export function scrollToElement(
  target: HTMLElement,
  { immediate = false }: { immediate?: boolean } = {},
) {
  /* Layout position, ignoring transforms: a target mid-entrance (e.g. still
     shifted down by a reveal animation) would otherwise be overshot. */
  const top = Math.max(0, layoutTop(target) - headerOffset());

  if (instance) {
    instance.scrollTo(top, { immediate });
    return;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top,
    behavior: immediate ? "instant" : reduce ? "auto" : "smooth",
  });
}

/** Distance from the top of the document, from layout (not transforms). */
function layoutTop(element: HTMLElement): number {
  let top = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
  }
  return top;
}
