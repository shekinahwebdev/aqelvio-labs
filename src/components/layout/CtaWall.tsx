"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { primaryCta } from "@/config/navigation";
import { useCurrentPath } from "@/lib/use-current-path";
import { useStartProjectLink } from "@/lib/use-start-project-link";
import { Button } from "@/components/ui/Button";
import { ctaMotion, ctaWall } from "@/data/home-closing";

/*
 * Shared image-wall call to action (rendered once, by the root layout,
 * after every page's content), rebuilt from the reference's CTA timeline
 * (see ctaMotion). A sticky stage is held while panels of our own work
 * rise into a regular wall, a dark overlay settles over them, the
 * headline's letters rise and "Start a Project" arrives, then it holds
 * briefly and releases into the footer. Scrubbed, so it reverses.
 *
 * Without the [data-cw="scroll"] state (reduced motion, no JS) everything
 * is already in its final place: a static wall, the overlay, the headline
 * and the button, in normal flow. The animation only ever starts from
 * that state, so a failure can't leave the call to action hidden.
 */
/*
 * Re-measure all ScrollTriggers, but never while the menu holds the scroll
 * lock (the body is fixed at an offset then, so positions would be read
 * shifted by the page's scroll); wait for it to be released.
 */
function refreshWhenUnlocked(): () => void {
  let timer = 0;
  const attempt = () => {
    if (document.body.style.position === "fixed") {
      timer = window.setTimeout(attempt, 150);
      return;
    }
    ScrollTrigger.refresh();
  };
  timer = window.setTimeout(attempt, 0);
  return () => window.clearTimeout(timer);
}

const WIDE = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const COMPACT = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";

export function CtaWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const path = useCurrentPath();
  /* On the contact page this goes to its enquiry form rather than reload it. */
  const startProject = useStartProjectLink();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add({ wide: WIDE, compact: COMPACT }, (context) => {
      const m = context.conditions?.wide ? ctaMotion.desktop : ctaMotion.compact;
      section.dataset.cw = "scroll";
      section.style.setProperty("--cw-distance", String(m.distance + m.hold));

      const cells = [...section.querySelectorAll<HTMLElement>(".cw-cell")].filter(
        (cell) => getComputedStyle(cell).display !== "none",
      );
      const timeline = gsap.timeline({
        defaults: { ease: "sine" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: ctaMotion.scrub,
        },
      });

      timeline
        .from(cells, {
          stagger: { amount: ctaMotion.spread, from: "random" },
          /* The wall is two rows, so 200% of a panel's height is one
             viewport: no measuring, nothing to recompute on refresh
             (re-recording would drop the panels' hidden start state). */
          yPercent: 200 * m.rise,
          rotationX: m.tilt,
          z: m.depth,
          transformOrigin: "50% 0%",
          autoAlpha: 0,
        })
        .from(section.querySelector(".cw-overlay"), { opacity: 0 }, ">")
        .from(
          section.querySelectorAll(".cw-char"),
          { yPercent: 300, autoAlpha: 0, stagger: { each: ctaMotion.charStagger, from: "random" } },
          "<",
        )
        .from(section.querySelectorAll(".cw-after"), { opacity: 0, yPercent: 40 }, ">");

      /* Hold the finished state for a moment before the stage releases. */
      timeline.to({}, { duration: (timeline.duration() * m.hold) / m.distance });

      return () => {
        delete section.dataset.cw;
        section.style.removeProperty("--cw-distance");
      };
    });

    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

    return () => {
      alive = false;
      mm.revert();
    };
  }, []);

  /*
   * This section lives in the shared layout, so it outlasts every page
   * above it. Whenever that content changes height (a client-side
   * navigation, Back/Forward, an FAQ opening, late images) the triggers
   * re-measure once it settles, so none keep another page's positions.
   */
  useEffect(() => {
    const main = sectionRef.current?.parentElement;
    if (!main) return;
    let timer = 0;
    let cancel = () => {};
    let lastHeight = main.offsetHeight;
    const observer = new ResizeObserver(() => {
      if (main.offsetHeight === lastHeight) return;
      lastHeight = main.offsetHeight;
      window.clearTimeout(timer);
      cancel();
      timer = window.setTimeout(() => (cancel = refreshWhenUnlocked()), 120);
    });
    observer.observe(main);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      cancel();
    };
  }, []);

  /* A new page also starts at a new scroll position: measure for it. */
  useEffect(() => {
    if (path === null) return;
    return refreshWhenUnlocked();
  }, [path]);

  const words = ctaWall.headline.split(" ");

  return (
    <section ref={sectionRef} id="start-a-project" aria-labelledby="cta-wall-title" className="cw">
      <div className="cw-stage">
        <div className="cw-grid" aria-hidden="true">
          {ctaWall.images.map((image) => (
            <div key={image.src} className="cw-cell" data-compact={image.compact || undefined}>
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(min-width: 768px) 25vw, 34vw"
                style={{ objectPosition: image.position }}
                className="cw-img"
              />
            </div>
          ))}
        </div>
        <div className="cw-overlay" aria-hidden="true" />

        <div className="cw-content">
          <h2 id="cta-wall-title" className="cw-title">
            <span className="sr-only">{ctaWall.headline}</span>
            <span aria-hidden="true">
              {words.map((word, w) => (
                <span key={w}>
                  {w ? " " : null}
                  <span className="cw-word">
                    {[...word].map((char, c) => (
                      <span key={c} className="cw-char">
                        {char}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </span>
          </h2>
          <div className="cw-after">
            <Button href={startProject.href} onClick={startProject.onClick} showArrow>
              {primaryCta.label}
            </Button>
          </div>
          <p className="cw-after cw-credit">{ctaWall.credit}</p>
        </div>
      </div>
    </section>
  );
}
