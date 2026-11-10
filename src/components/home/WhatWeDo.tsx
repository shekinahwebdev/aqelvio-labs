"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cubeFaces, cubeMotion, cubeRestPose, itemRevealAt, whatWeDo } from "@/data/what-we-do";

/*
 * "What We Do": the heading split around an image cube, with the three
 * service groups placed around it.
 *
 * The cube reproduces the motion reference's scroll timeline (measured
 * live, see cubeMotion): it scales in, then turns continuously with scroll —
 * 2.5 turns in all — while its faces separate, twist into a diamond and
 * shear into loose planes. It is scrubbed: stopping the scroll stops it,
 * scrolling back plays it backwards, nothing runs on its own.
 *
 * Layers, one job each:
 *   .wwd-pin       the compact pin (display: contents on desktop)
 *   .wwd-visual    placement in the layout
 *   .wwd-entrance  entrance scale
 *   .wwd-scene     perspective
 *   .wwd-cube      global rotation, and the --sep / --tw / --sk variables
 *   .wwd-face      the face's own transform (hinge, twist, shear) in CSS
 *   .wwd-side      the two upright image sides of each face
 *
 * With motion, [data-wwd="scroll"] pins for cubeMotion.pinViewports
 * viewport heights at every width, as the reference does: ≥1024px the whole
 * stage is sticky; under 1024px only .wwd-pin (heading + sculpture) is,
 * and the three groups follow it. Reduced motion / no JS: no pin, a still,
 * opened arrangement; everything visible.
 */
const DESKTOP = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const COMPACT = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";

const restStyle = {
  transform: `rotateY(${cubeRestPose.rotateY}deg)`,
  "--sep": cubeRestPose.separate,
  "--tw": cubeRestPose.twist,
  "--sk": cubeRestPose.shear,
  "--twist-deg": `${cubeMotion.twist.deg}deg`,
  "--skew-deg": `${cubeMotion.shear.skewDeg}deg`,
} as CSSProperties;

export function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const pin = section.querySelector<HTMLElement>(".wwd-pin")!;
    const entrance = section.querySelector<HTMLElement>(".wwd-entrance")!;
    const cube = section.querySelector<HTMLElement>(".wwd-cube")!;
    const items = [...section.querySelectorAll<HTMLElement>(".wwd-item")];

    /* The reference's timeline, unit for unit, all linear. */
    const build = (tl: gsap.core.Timeline, turn: number) => {
      const { entrance: e, rotate: r, separate: s, twist: t, shear: k } = cubeMotion;
      tl.fromTo(entrance, { scale: 0 }, { scale: 1, duration: e.duration }, e.at)
        .fromTo(cube, { rotationY: 0 }, { rotationY: turn, duration: r.duration }, r.at)
        .fromTo(cube, { "--sep": 1 }, { "--sep": s.scale, duration: s.duration }, s.at)
        .fromTo(cube, { "--tw": 0 }, { "--tw": 1, duration: t.duration }, t.at)
        /* Deferred: its start value (twisted) must not apply before the playhead gets here. */
        .fromTo(cube, { "--tw": 1 }, { "--tw": 0, duration: k.duration, immediateRender: false }, k.at)
        .fromTo(cube, { "--sk": 0 }, { "--sk": 1, duration: k.duration }, k.at);
    };

    const mm = gsap.matchMedia();

    mm.add({ desktop: DESKTOP, compact: COMPACT }, (context) => {
      const desktop = Boolean(context.conditions?.desktop);
      section.style.setProperty("--wwd-pin", String(cubeMotion.pinViewports));
      section.dataset.wwd = "scroll";

      /* Desktop pins the whole stage (the section); compact pins only the
         heading and sculpture (.wwd-pin), with the three groups after it. */
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: desktop ? section : pin, start: cubeMotion.start, end: cubeMotion.end, scrub: true },
      });
      build(tl, cubeMotion.rotate.deg);
      if (desktop) {
        items.forEach((item, i) => {
          tl.fromTo(item, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.5 }, itemRevealAt[i]);
        });
      }

      return () => {
        delete section.dataset.wwd;
        section.style.removeProperty("--wwd-pin");
      };
    });

    /* Image sizes don't affect layout, but re-measure once images and fonts settle. */
    let alive = true;
    const refresh = () => alive && ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    const pending = [...section.querySelectorAll("img")]
      .filter((img) => !img.complete)
      .map((img) => img.decode().catch(() => {}));
    if (pending.length) Promise.all(pending).then(refresh);

    return () => {
      alive = false;
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="what-we-do" aria-labelledby="what-we-do-heading" className="wwd relative bg-[#060606]">
      <div className="wwd-stage relative mx-auto max-w-[var(--container-max)] px-[var(--container-pad)] py-20 md:py-24">
        <div className="wwd-pin">
          <h2 id="what-we-do-heading" className="wwd-heading font-display font-medium tracking-[-0.04em] text-foreground">
            <span className="wwd-word">{whatWeDo.heading.lead}</span>{" "}
            <span className="wwd-visual" aria-hidden="true">
              <span className="wwd-entrance">
                <span className="wwd-scene">
                  <span className="wwd-cube" style={restStyle}>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <span key={`core-${i}`} className="wwd-core" data-tilt={i < 3 ? "down" : "up"} />
                    ))}
                    {cubeFaces.map((face) => (
                      <span
                        key={face.face}
                        className="wwd-face"
                        data-face={face.face}
                        style={{ "--z": face.z, "--hinge": face.hinge, transformOrigin: face.origin } as CSSProperties}
                      >
                        <span className="wwd-side">
                          <Image src={face.src} alt="" fill sizes="(min-width: 1024px) 320px, 45vw" loading="eager" fetchPriority="low" className="object-cover" style={{ objectPosition: face.position ?? "50% 50%" }} />
                        </span>
                        <span className="wwd-side wwd-side--inner">
                          <Image src={face.backSrc} alt="" fill sizes="(min-width: 1024px) 320px, 45vw" loading="eager" fetchPriority="low" className="object-cover" style={{ objectPosition: face.backPosition ?? "50% 50%" }} />
                        </span>
                      </span>
                    ))}
                  </span>
                </span>
              </span>
            </span>{" "}
            <span className="wwd-word">{whatWeDo.heading.trail}</span>
          </h2>
        </div>

        <ul role="list" className="wwd-items">
          {whatWeDo.items.map((item, i) => (
            <li key={item.title} className="wwd-item" data-index={i}>
              <h3 className="text-[1.375rem] leading-[1.3] font-medium tracking-[-0.02em] text-foreground">{item.title}</h3>
              <p className="mt-3 text-base leading-[1.55] text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
