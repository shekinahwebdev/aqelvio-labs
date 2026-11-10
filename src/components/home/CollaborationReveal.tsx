"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { collaboration } from "@/config/collaboration";
import { getLenis } from "@/lib/smooth-scroll";

/*
 * Collaboration statement: two brand names in heavy type, filled with one
 * continuous image, revealed by scroll.
 *
 * Layers (outer → inner), each with one job:
 *   stage        pinned below the header; owns the image-motion variable
 *   .collab-mask clips vertically only — the rising mask (never animated)
 *   reveal       translate/scale for the reveal (GSAP)
 *   .collab-fill the semantic text, image clipped to the glyphs
 *                (background-clip: text; solid text where unsupported)
 *
 * Pinning is native `position: sticky` just below the header: with motion
 * on, the section is (1 + PIN) stage heights tall and the stage sticks for
 * the extra PIN heights (globals.css, [data-collab-pin]). ScrollTrigger only
 * scrubs the timeline over the section's passage — top entering the
 * viewport → bottom reaching it, when the stage releases. In stage heights:
 * ~1 to scroll the stage in, then PIN pinned. "Aqelvio Labs" starts rising
 * once the stage is ~40% in, then the connector, then "Acheva Graphix",
 * then a short hold before release. It follows the scrollbar both ways.
 *
 * Reduced motion (and no JS): nothing is hidden or pinned — the CSS default
 * is the finished composition, in normal flow.
 */

const PIN = { desktop: 1.6, compact: 1 } as const;
const IMAGE_ASPECT = 2400 / 1500;

const MOTION = "(prefers-reduced-motion: no-preference)";
const COMPACT = "(max-width: 767px)";

export function CollaborationReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLSpanElement>(null);
  const connectorRef = useRef<HTMLSpanElement>(null);
  const partnerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const lead = leadRef.current;
    const connector = connectorRef.current;
    const partner = partnerRef.current;
    if (!section || !stage || !lead || !connector || !partner) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const fills = [...stage.querySelectorAll<HTMLElement>(".collab-fill")];
    const headerHeight = () =>
      document.querySelector("header")?.getBoundingClientRect().height ?? 0;

    /*
     * Fit the names to the stage. One line each when that leaves them at
     * least 56px tall; otherwise each name wraps between words and is sized
     * to its longest word. Capped so the whole composition fits the stage.
     */
    const fit = () => {
      const width = stage.clientWidth -
        Number.parseFloat(getComputedStyle(stage).paddingLeft) * 2;
      const probe = document.createElement("span");
      const font = getComputedStyle(fills[0]);
      Object.assign(probe.style, {
        position: "absolute",
        visibility: "hidden",
        whiteSpace: "pre",
        fontFamily: font.fontFamily,
        fontWeight: font.fontWeight,
        letterSpacing: "-0.045em",
        fontSize: "100px",
      });
      stage.append(probe);
      const measure = (text: string) => {
        probe.textContent = text;
        return probe.getBoundingClientRect().width;
      };
      const names = [collaboration.lead, collaboration.partner];
      const full = Math.max(...names.map(measure));
      const word = Math.max(...names.flatMap((n) => n.split(" ")).map(measure));
      probe.remove();

      let size = ((width * 0.96) / full) * 100;
      let lines = 2;
      const wrap = size < 56;
      if (wrap) {
        size = ((width * 0.96) / word) * 100;
        lines = names.reduce((sum, n) => sum + n.split(" ").length, 0);
      }
      const available =
        (window.innerHeight - headerHeight()) * 0.8 - connector.offsetHeight;
      size = Math.min(size, available / (lines * 0.9), 260);

      stage.style.setProperty("--collab-size", `${size.toFixed(2)}px`);
      stage.dataset.wrap = wrap ? "true" : "false";
    };

    /*
     * One image across both names: each fill gets the same cover-sized
     * background, offset by its own layout position in the stage (offsets
     * ignore the reveal transforms, so the image stays continuous).
     */
    const measureFill = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const coverW = Math.max(w, h * IMAGE_ASPECT);
      const coverH = coverW / IMAGE_ASPECT;
      stage.style.setProperty("--fill-w", `${coverW}px`);
      stage.style.setProperty("--fill-h", `${coverH}px`);
      fills.forEach((fill) => {
        let x = 0;
        let y = 0;
        let node: HTMLElement | null = fill;
        while (node && node !== stage) {
          x += node.offsetLeft;
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        fill.style.setProperty("--fill-x", `${-x - (coverW - w) / 2}px`);
        fill.style.setProperty("--fill-y", `${-y - (coverH - h) / 2}px`);
      });
      stage.dataset.fill = "measured";
    };

    const layout = () => {
      fit();
      measureFill();
    };
    layout();

    /* Recalculate once fonts and the fill image are ready, and on resize. */
    let alive = true;
    const relayout = () => {
      if (!alive) return;
      layout();
      ScrollTrigger.refresh();
    };
    document.fonts?.ready.then(relayout);
    const img = new Image();
    img.src = window.matchMedia(COMPACT).matches
      ? collaboration.image.srcSmall
      : collaboration.image.src;
    img.decode().then(relayout, () => {});

    ScrollTrigger.addEventListener("refreshInit", layout);
    let size = `${stage.clientWidth}x${stage.clientHeight}`;
    const observer = new ResizeObserver(() => {
      const next = `${stage.clientWidth}x${stage.clientHeight}`;
      if (next !== size) {
        size = next;
        layout();
      }
    });
    observer.observe(stage);

    const mm = gsap.matchMedia();
    mm.add({ motion: MOTION, compact: COMPACT }, (context) => {
      const { motion, compact } = context.conditions as {
        motion: boolean;
        compact: boolean;
      };
      if (!motion) {
        return;
      }

      const pin = compact ? PIN.compact : PIN.desktop;
      section.style.setProperty("--collab-pin", String(pin));
      section.dataset.collabPin = "";
      layout();
      /* Native (touch) scrolling gets a little catch-up; Lenis already eases. */
      const scrub = getLenis() ? true : 0.35;

      const t = compact
        ? { lead: 0.3, leadDur: 0.7, connector: 0.95, partner: 1.1, partnerDur: 0.65 }
        : { lead: 0.4, leadDur: 0.85, connector: 1.15, partner: 1.35, partnerDur: 0.85 };
      const total = 1 + pin;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom bottom",
          scrub,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(stage, { "--img-p": 0 }, { "--img-p": 1, duration: total }, 0)
        .fromTo(
          lead,
          { yPercent: 135, scale: 1.08 },
          { yPercent: 0, scale: 1, duration: t.leadDur, ease: "power2.out" },
          t.lead,
        )
        .fromTo(
          connector,
          /* Opacity only: visibility:hidden would drop it from the heading's accessible name. */
          { opacity: 0, yPercent: 70 },
          { opacity: 1, yPercent: 0, duration: 0.3, ease: "power1.out" },
          t.connector,
        )
        .fromTo(
          partner,
          { yPercent: 135, scale: 1.08 },
          { yPercent: 0, scale: 1, duration: t.partnerDur, ease: "power2.out" },
          t.partner,
        )
        .set({}, {}, total);

      return () => {
        delete section.dataset.collabPin;
        section.style.removeProperty("--collab-pin");
      };
    });

    return () => {
      alive = false;
      observer.disconnect();
      ScrollTrigger.removeEventListener("refreshInit", layout);
      mm.revert();
    };
  }, []);

  const images = {
    "--collab-img": `url("${collaboration.image.src}")`,
    "--collab-img-small": `url("${collaboration.image.srcSmall}")`,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      id="collaboration"
      aria-labelledby="collaboration-heading"
      className="overflow-x-clip bg-[#050505]"
      style={images}
    >
      <div
        ref={stageRef}
        className="collab-stage @container relative flex flex-col items-center justify-center px-4 py-24 md:px-8 lg:px-10"
      >
        <h2
          id="collaboration-heading"
          className="relative flex w-full flex-col items-center text-center"
        >
          <span className="collab-mask relative block w-full">
            <span ref={leadRef} className="relative block origin-bottom will-change-transform">
              <span className="collab-fill relative block">{collaboration.lead}</span>
            </span>
          </span>{" "}
          <span
            ref={connectorRef}
            className="collab-connector relative block font-sans font-normal text-muted"
          >
            {collaboration.connector}
          </span>{" "}
          <span className="collab-mask relative block w-full">
            <span ref={partnerRef} className="relative block origin-bottom will-change-transform">
              <span className="collab-fill relative block">{collaboration.partner}</span>
            </span>
          </span>
        </h2>
      </div>
    </section>
  );
}
