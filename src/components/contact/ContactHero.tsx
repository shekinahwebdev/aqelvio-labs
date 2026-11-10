"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/*
 * "Let's [image] Talk", after the reference (Qubix /contact, sampled live
 * at 1440×900 and 768×1024):
 *   - The section is two viewports tall; a viewport-tall row holds still
 *     (sticky) with "Let's", the image and "Talk" spread across the
 *     container, words against the image, everything vertically centred.
 *   - Scrolling scales the whole row from 0.6 to 1 over one viewport, then
 *     it releases (scrubbed, so it reverses).
 *   - On load the image rises 50px and fades in (about 0.5s).
 *   - Phones: a static, compact row, no hold or scaling.
 * Without the [data-ch="scroll"] state (reduced motion, no JS, phones) the
 * row is static at full size in normal flow.
 */
const SCALE = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

export function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const row = section.querySelector<HTMLElement>(".ch-row")!;
    const mm = gsap.matchMedia();

    /* The image's entrance is a CSS animation (globals.css), so it plays
       from first paint with no flash before hydration. */
    mm.add(SCALE, () => {
      section.dataset.ch = "scroll";
      gsap.fromTo(
        row,
        { scale: 0.6 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
        },
      );
      return () => {
        delete section.dataset.ch;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="contact-heading" className="ch">
      <div className="ch-stage">
        <h1 id="contact-heading" className="sr-only">
          Let’s talk
        </h1>
        <div className="ch-row">
          <span className="ch-word" aria-hidden="true">
            Let’s
          </span>
          <figure className="ch-media">
            <Image
              src="/images/projects/choco-buddy-animation-poster.jpg"
              alt=""
              fill
              preload
              sizes="(min-width: 768px) 72vw, 56vw"
              className="ch-img"
            />
          </figure>
          <span className="ch-word" aria-hidden="true">
            Talk
          </span>
        </div>
        <p className="ch-credit">Image: Choco Buddy animation by Acheva Graphix (collaborator)</p>
      </div>
    </section>
  );
}
