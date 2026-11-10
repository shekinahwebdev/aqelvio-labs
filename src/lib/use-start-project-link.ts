"use client";

import type { MouseEvent } from "react";
import { contactEnquiryId, primaryCta } from "@/config/navigation";
import { scrollToElement } from "@/lib/smooth-scroll";
import { useCurrentPath } from "@/lib/use-current-path";

/**
 * "Start a Project" goes to the contact page; on the contact page itself it
 * goes to the enquiry form instead of reloading the page: scrolled below
 * the sticky header (through Lenis where active) with focus moved to the
 * form's heading, so keyboard and screen-reader users land there too.
 */
export function useStartProjectLink() {
  const path = useCurrentPath();
  const onContact = path?.replace(/\/$/, "") === primaryCta.href;

  if (!onContact) {
    return { href: primaryCta.href, onClick: undefined };
  }

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(contactEnquiryId);
    if (!target) return;
    event.preventDefault();
    /* Keyboard activation fires a click with detail 0: jump, don't glide. */
    scrollToElement(target, { immediate: event.detail === 0 });
    target.querySelector<HTMLElement>("[data-enquiry-focus]")?.focus({ preventScroll: true });
    history.replaceState(history.state, "", `#${contactEnquiryId}`);
  };

  return { href: `#${contactEnquiryId}`, onClick };
}
