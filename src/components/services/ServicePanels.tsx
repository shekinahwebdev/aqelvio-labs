"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Button } from "@/components/ui/Button";
import { serviceCatalog, servicesIntro, type Service } from "@/data/service-catalog";
import { collaborator } from "@/data/service-categories";

/*
 * The design service panels: title and description, media, deliverables and
 * a "Discuss this service" action. Desktop is three columns, tablet two,
 * phones one, in reading order (title, description, media, deliverables,
 * action). Panels alternate charcoal and off-white.
 *
 * Motion, from the reference (Qubix /services, sampled live): panels sit in
 * normal flow (no pinning or stacking); each rises about 100px and fades in
 * once as it scrolls into view, over roughly a second. Content is in place
 * without JS, and with reduced motion nothing moves.
 */
const MOTION = "(prefers-reduced-motion: no-preference)";

export function ServicePanels() {
  const listRef = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      list.querySelectorAll<HTMLElement>(".sv-panel").forEach((panel) => {
        /* Opacity only (not autoAlpha): a panel waiting below the fold
           stays in the accessibility tree and reachable by Tab, and
           focusing it scrolls it in, which reveals it. */
        gsap.from(panel, {
          y: 100,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, start: "top 92%", once: true },
        });
      });
    });

    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());
    return () => {
      alive = false;
      mm.revert();
    };
  }, []);

  return (
    <section id={servicesIntro.anchorId} aria-labelledby="sv-heading" className="sv">
      <div className="sv-head-block">
        <p className="pr-label" aria-hidden="true">
          <span>Design services</span>
          <span className="pr-label-name">{serviceCatalog.length} disciplines</span>
        </p>
        <h2 id="sv-heading" className="pr-heading">
          Design, in detail.
        </h2>
        <p className="pr-text">
          Website, product and mobile app design are part of our development work. Brand identity, social media, logo,
          flyer and poster design and motion graphics may be provided in collaboration with {collaborator.name},{" "}
          {collaborator.description}; each panel credits who made the work shown.
        </p>
      </div>
      <ol ref={listRef} role="list" className="sv-list">
        {serviceCatalog.map((service, index) => (
          <ServicePanel key={service.id} service={service} tone={index % 2 === 0 ? "dark" : "light"} />
        ))}
      </ol>
    </section>
  );
}

function ServicePanel({ service, tone }: { service: Service; tone: "dark" | "light" }) {
  const headingId = `${service.id}-title`;
  return (
    <li id={service.id} className="sv-panel" data-tone={tone} aria-labelledby={headingId}>
      <div className="sv-head">
        <p className="sv-num" aria-hidden="true">
          {service.number}
        </p>
        <h2 id={headingId} className="sv-title">
          {service.title}
        </h2>
      </div>

      <p className="sv-desc">{service.description}</p>

      <figure className="sv-media">
        <ServiceMediaView service={service} />
        <figcaption className="sv-source" data-kind={service.source.kind}>
          {service.source.text}
        </figcaption>
      </figure>

      <div className="sv-deliverables">
        <h3 className="sv-label">Deliverables</h3>
        <ul role="list" className="sv-items">
          {service.deliverables.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="sv-action">
        <Button href={service.contactHref} showArrow>
          <>
            Discuss this service<span className="sr-only">: {service.title}</span>
          </>
        </Button>
      </div>
    </li>
  );
}

function ServiceMediaView({ service }: { service: Service }) {
  const { media } = service;

  if (media.type === "video") {
    return (
      <div className="sv-frame">
        <VideoPlayer
          className="sv-video"
          src={media.src}
          poster={media.poster}
          width={media.width}
          height={media.height}
          label={media.label}
          title={service.title}
        />
      </div>
    );
  }

  const style = { backgroundColor: media.backdrop?.color } as CSSProperties;
  return (
    <div className="sv-frame" data-fit={media.fit} style={style}>
      {media.backdrop?.image ? (
        <div className="sv-backdrop" aria-hidden="true" style={{ backgroundImage: `url(${media.backdrop.image})` }} />
      ) : null}
      <div className="sv-art">
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes="(min-width: 1024px) 34vw, (min-width: 768px) 46vw, 92vw"
          className="sv-img"
          style={{ objectPosition: media.position ?? "50% 50%" }}
        />
      </div>
    </div>
  );
}
