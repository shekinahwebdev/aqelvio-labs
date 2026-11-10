"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { showcaseServices, type ShowcaseService } from "@/data/services-showcase";

/*
 * Services showcase: a staggered, image-led gallery of the nine services.
 *
 * Motion follows the reference's services gallery (measured live at
 * 768–1440px): while the section scrolls in, "Services" settles from a
 * larger, centred position to its place at the left (here along the lower
 * track's bottom edge, so no label ever crosses it); then, with the stage
 * held below the header, the two-track strip travels in from beyond the
 * right edge and passes across the stage; the images run over the title.
 * There is no image parallax in the reference, so none here. Adapted for
 * nine services: the strip stops with the last service fully in view,
 * holds briefly, then the section releases.
 *
 * One list serves every layout (reading order 01–09):
 *   default / no JS / reduced motion  normal-flow grid of varied panels
 *   ≥768px with motion                [data-showcase="scroll"] — sticky
 *                                     stage, horizontal travel (globals.css)
 *   <768px with motion                the vertical sequence, with a
 *                                     restrained fade-up as items arrive
 *
 * Scroll distance: the strip travels from the stage's right edge until the
 * last panel sits inside the right gutter (strip width + gutter), at
 * SPEED px of horizontal travel per px of scroll, plus a HOLD of stage
 * height. Measured from the rendered strip on every refresh.
 */
const SPEED = 2;
const HOLD = 0.3;
const TITLE_START_SCALE = 1.2;

const SCROLL = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const REVEAL = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";

export function ServicesShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const stage = section.querySelector<HTMLElement>("[data-showcase-stage]")!;
    const strip = section.querySelector<HTMLElement>("[data-showcase-strip]")!;
    const title = section.querySelector<HTMLElement>("[data-showcase-title]")!;
    const titleWrap = section.querySelector<HTMLElement>("[data-showcase-title-wrap]")!;
    const items = [...section.querySelectorAll<HTMLElement>("[data-showcase-item]")];

    /* Re-measure once images and fonts have settled. */
    let alive = true;
    const refresh = () => alive && ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    const pending = [...section.querySelectorAll("img")]
      .filter((img) => !img.complete)
      .map((img) => img.decode().catch(() => {}));
    if (pending.length) Promise.all(pending).then(refresh);

    const mm = gsap.matchMedia();

    mm.add(SCROLL, () => {
      section.dataset.showcase = "scroll";

      const geo = { enter: 1, pin: 1, x0: 0, x1: 0, titleDx: 0, titleDy: 0 };
      const measure = () => {
        section.style.removeProperty("height");
        const stageW = stage.clientWidth;
        const stageH = stage.clientHeight;
        const gutter = Number.parseFloat(getComputedStyle(stage).paddingRight) || 0;
        geo.x0 = stageW;
        geo.x1 = stageW - gutter - strip.scrollWidth;
        /* The stage sticks at its own `top` (the header height token). Read it
           from the stage: the real header can still be a placeholder while
           this first runs, and would measure 0. */
        const stickyTop = Number.parseFloat(getComputedStyle(stage).top) || 0;
        geo.enter = Math.max(1, window.innerHeight - stickyTop);
        geo.pin = Math.max(1, (geo.x0 - geo.x1) / SPEED);
        /* Entry starts the title centred in the stage. The wrapper's box is
           its resting place (only the heading inside it is animated). */
        const stageBox = stage.getBoundingClientRect();
        const rest = titleWrap.getBoundingClientRect();
        geo.titleDx = stageW / 2 - (rest.left - stageBox.left + rest.width / 2);
        geo.titleDy = stageH / 2 - (rest.top - stageBox.top + rest.height / 2);
        section.style.height = `${stageH + geo.pin + stageH * HOLD}px`;
      };
      measure();
      ScrollTrigger.addEventListener("refreshInit", measure);

      const setStripX = gsap.quickSetter(strip, "x", "px");
      const setTitleX = gsap.quickSetter(title, "x", "px");
      const setTitleY = gsap.quickSetter(title, "y", "px");
      const setTitleScale = gsap.quickSetter(title, "scale");

      const render = (self: ScrollTrigger) => {
        const scrolled = self.progress * (self.end - self.start);
        const t = gsap.utils.clamp(0, 1, scrolled / geo.enter);
        const u = gsap.utils.clamp(0, 1, (scrolled - geo.enter) / geo.pin);
        setTitleX(geo.titleDx * (1 - t));
        setTitleY(geo.titleDy * (1 - t));
        setTitleScale(TITLE_START_SCALE - (TITLE_START_SCALE - 1) * t);
        setStripX(geo.x0 + (geo.x1 - geo.x0) * u);
      };

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom bottom",
        onUpdate: render,
        onRefresh: render,
      });
      render(trigger);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", measure);
        delete section.dataset.showcase;
        section.style.removeProperty("height");
        gsap.set([strip, title], { clearProps: "transform" });
      };
    });

    mm.add(REVEAL, () => {
      /* Only what's still below the fold; anything already seen stays put. */
      const below = items.filter((el) => el.getBoundingClientRect().top > window.innerHeight);
      gsap.set(below, { opacity: 0, y: 24 });
      ScrollTrigger.batch(below, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08 }),
      });
    });

    return () => {
      alive = false;
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services-showcase"
      aria-labelledby="services-showcase-heading"
      className="showcase relative bg-[#080808]"
    >
      <div
        data-showcase-stage
        className="showcase-stage relative mx-auto max-w-[var(--container-max)] px-[var(--container-pad)] py-20 md:py-28"
      >
        {/* Placement (wrapper) and motion (heading) are separate layers. */}
        <div data-showcase-title-wrap className="showcase-title-wrap">
          <h2
            id="services-showcase-heading"
            data-showcase-title
            className="font-display text-[clamp(3.25rem,1.5rem+7vw,9.5rem)] leading-[0.9] font-medium tracking-[-0.05em] text-foreground"
          >
            Services
          </h2>
        </div>

        <ol role="list" data-showcase-strip className="showcase-strip mt-12 md:mt-16">
          {showcaseServices.map((service) => (
            <li
              key={service.number}
              data-showcase-item
              data-size={service.size}
              data-track={service.track}
              className="showcase-item"
            >
              <ShowcaseCard service={service} />
            </li>
          ))}
        </ol>

        <p className="showcase-note mt-12 max-w-[34rem] text-[0.8125rem] leading-[1.5] text-muted">
          Illustrative concepts made to show each service; not client work.
        </p>
      </div>
    </section>
  );
}

function ShowcaseCard({ service }: { service: ShowcaseService }) {
  const body = (
    <>
      <div className="showcase-frame relative overflow-hidden rounded-[14px] bg-[#151515]">
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          loading="eager"
          fetchPriority="low"
          sizes={
            service.size === "wide"
              ? "(min-width: 1024px) 600px, (min-width: 768px) 460px, 100vw"
              : "(min-width: 1024px) 330px, (min-width: 768px) 280px, 100vw"
          }
          className="object-cover"
        />
      </div>
      <div className="showcase-info">
        <span aria-hidden="true" className="block text-base leading-[1.44] tracking-[-0.02em] text-muted">
          {service.number}
        </span>
        <h3 className="text-xl leading-[1.3] font-medium tracking-[-0.02em] text-foreground">
          {service.title}
        </h3>
      </div>
    </>
  );

  if (service.href) {
    return (
      <Link
        href={service.href}
        className="showcase-card group block rounded-[14px] outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-4 focus-visible:ring-offset-[#080808]"
      >
        {body}
      </Link>
    );
  }
  return <div className="showcase-card">{body}</div>;
}
