"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  aboutApproach,
  aboutHero,
  aboutProcess,
  aboutStory,
  aboutValues,
  aboutWork,
  founders,
  type Founder,
} from "@/data/about";
import { serviceById } from "@/data/service-catalog";
import { projects, type Project } from "@/data/projects";

/*
 * /about, after the reference (Kaelorian /about, read from its live
 * interactions and sampled at 1440×900 and 390×844):
 *   - Hero: the cover settles from 1.15 scale, the oversized name drops in
 *     from -80px, the corner labels fade in; the statements then rise 70px
 *     through a masked line one after another, on a loop (CSS, globals.css).
 *   - Section copy: words are scrubbed from 25% to full opacity as the
 *     paragraph passes through the viewport, and reverse on the way back.
 *   - Typographic statements roll up into place once (the reference's
 *     counters).
 *   - Founders: a sticky scene; the profiles slide in from the right across
 *     the giant title as you scroll (desktop and tablet).
 *   - Rows and blocks rise 60px and fade in once.
 * Reduced motion / no JS: everything static and fully visible.
 */
const MOTION = "(prefers-reduced-motion: no-preference)";
const STICKY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

export function AboutView() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(MOTION, () => {
      /* Blocks that have not been revealed yet are completed as soon as
         keyboard focus enters them, so focus never lands on hidden text. */
      const reveals = new Map<Element, gsap.core.Tween>();
      const onFocus = (event: FocusEvent) => {
        const block = (event.target as HTMLElement).closest("[data-ab-rise], [data-ab-roll]");
        if (block) reveals.get(block)?.progress(1);
      };
      root.addEventListener("focusin", onFocus);

      root.querySelectorAll<HTMLElement>("[data-ab-words]").forEach((block) => {
        gsap.fromTo(
          block.querySelectorAll(".ab-w"),
          { opacity: 0.25 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: block, start: "top 85%", end: "bottom 55%", scrub: true },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-ab-roll]").forEach((group) => {
        const tween = gsap.from(group.querySelectorAll(".ab-roll-inner"), {
          yPercent: 110,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: group, start: "top 85%", once: true },
        });
        reveals.set(group, tween);
      });

      root.querySelectorAll<HTMLElement>("[data-ab-rise]").forEach((el) => {
        const tween = gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
        reveals.set(el, tween);
      });

      return () => root.removeEventListener("focusin", onFocus);
    });

    mm.add(STICKY, () => {
      const scene = root.querySelector<HTMLElement>(".ab-founders")!;
      scene.dataset.abScene = "scroll";
      gsap.fromTo(
        scene.querySelector(".ab-founder-list"),
        { xPercent: 101 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: scene, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
        },
      );
      return () => {
        delete scene.dataset.abScene;
      };
    });

    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());
    return () => {
      alive = false;
      mm.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="ab">
      <Hero />
      <Story />
      <Process />
      <Founders />
      <Approach />
      <Work />
      <Values />
    </div>
  );
}

function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="ab-label" aria-hidden="true">
      <span>•{number}</span>
      <span className="ab-label-name">{label}</span>
      <span>Aqelvio Labs</span>
    </div>
  );
}

/* Words as spans for the scrubbed reveal; the text reads normally. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          {i ? " " : null}
          <span className="ab-w">{word}</span>
        </span>
      ))}
    </>
  );
}

function Hero() {
  const { images, labels, statements, wordmark, credit } = aboutHero;
  return (
    <section className="ab-hero" aria-labelledby="about-heading">
      <div className="ab-hero-cover" aria-hidden="true">
        {(["left", "right"] as const).map((side) => {
          const image = images[side];
          return image.backdrop ? (
            <div key={side} className="ab-hero-half ab-hero-framed">
              <div className="ab-hero-backdrop" style={{ backgroundImage: `url(${image.backdrop})` }} />
              <div className="ab-hero-frame">
                <Image src={image.src} alt="" fill preload sizes="36vw" className="ab-hero-img" style={{ objectPosition: image.position }} />
              </div>
            </div>
          ) : (
            <div key={side} className="ab-hero-half">
              <Image src={image.src} alt="" fill preload sizes="50vw" className="ab-hero-img" style={{ objectPosition: image.position }} />
            </div>
          );
        })}
        <div className="ab-hero-shade" />
      </div>

      <h1 id="about-heading" className="ab-wordmark">
        <span className="sr-only">About {wordmark}</span>
        <span aria-hidden="true">{wordmark}</span>
      </h1>

      {/* Read once by assistive technology; the cycling copy is visual. */}
      <p className="sr-only">{statements.join(" ")}</p>
      <div className="ab-statements" aria-hidden="true">
        {statements.map((statement, i) => (
          <span key={statement} className="ab-statement" style={{ "--i": i } as CSSProperties}>
            {statement}
          </span>
        ))}
      </div>

      <p className="ab-corner ab-corner-left">{labels.left}</p>
      <p className="ab-corner ab-corner-right">{labels.right}</p>
      <p className="ab-hero-credit">{credit}</p>
    </section>
  );
}

function Story() {
  return (
    <section className="ab-section" aria-labelledby="ab-story">
      <SectionLabel number="01" label="Our story" />
      <h2 id="ab-story" className="ab-heading">
        {aboutStory.heading.map((line) => (
          <span key={line} className="ab-line">
            {line}
          </span>
        ))}
      </h2>
      <div className="ab-story-copy" data-ab-words>
        {aboutStory.copy.map((para) => (
          <p key={para}>
            <Words text={para} />
          </p>
        ))}
      </div>
      <ul role="list" className="ab-statements-row" data-ab-roll>
        {aboutStory.statements.map((statement) => (
          <li key={statement} className="ab-roll">
            <span className="ab-roll-inner">{statement}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Process() {
  return (
    <section className="ab-section" aria-labelledby="ab-process">
      <SectionLabel number="02" label="How we work" />
      <h2 id="ab-process" className="sr-only">
        How we work
      </h2>
      <ol role="list" className="ab-rows">
        {aboutProcess.map((step) => (
          <li key={step.number} className="ab-row" data-ab-rise>
            <p className="ab-row-title">
              {step.number} / {step.title}
            </p>
            <p className="ab-row-text">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Founders() {
  return (
    <section className="ab-founders" aria-labelledby="ab-founders">
      <div className="ab-founders-stage">
        <div className="ab-founders-head">
          <SectionLabel number="03" label="The founders" />
        </div>
        <h2 id="ab-founders" className="ab-giant">
          Two founders
        </h2>
        <ul role="list" className="ab-founder-list">
          {founders.map((founder) => (
            <FounderCard key={founder.id} founder={founder} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FounderCard({ founder }: { founder: Founder }) {
  const image = founder.portrait ?? founder.work;
  return (
    <li className="ab-founder">
      <figure className="ab-founder-media">
        <Image
          src={image.src}
          alt={founder.portrait ? founder.portrait.alt : founder.work.alt}
          fill
          sizes="(min-width: 768px) 30vw, 90vw"
          style={{ objectPosition: image.position }}
          className="ab-founder-img"
        />
        {!founder.portrait ? <figcaption className="ab-founder-caption">{founder.work.caption}</figcaption> : null}
      </figure>
      <div className="ab-founder-text">
        <h3 className="ab-founder-name">{founder.name ?? founder.fallbackHeading}</h3>
        <p className="ab-founder-role">{founder.role}</p>
        <p className="ab-founder-bio">{founder.bio}</p>
      </div>
    </li>
  );
}

function Approach() {
  return (
    <section className="ab-section" aria-labelledby="ab-approach">
      <SectionLabel number="04" label="One connected approach" />
      <h2 id="ab-approach" className="ab-heading">
        {aboutApproach.heading}
      </h2>
      <div className="ab-approach-copy" data-ab-words>
        <p>
          <Words text={aboutApproach.copy} />
        </p>
      </div>
      <ul role="list" className="ab-areas">
        {aboutApproach.areas.map((area, i) => (
          <li key={area.title} className="ab-area" data-ab-rise>
            <p className="ab-area-index">0{i + 1}</p>
            <h3 className="ab-area-title">{area.title}</h3>
            <ul role="list" className="ab-area-services">
              {area.serviceIds.map((id) => {
                const service = serviceById(id);
                return (
                  <li key={id}>
                    <Link href={`/services#${id}`} className="ab-link">
                      {service.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
      <p className="ab-relationship" data-ab-rise>
        {aboutApproach.relationship}
      </p>
    </section>
  );
}

function Work() {
  const items = aboutWork.slugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));
  return (
    <section className="ab-section" aria-labelledby="ab-work">
      <SectionLabel number="05" label="Work that brings it together" />
      <h2 id="ab-work" className="ab-heading ab-heading-center">
        {aboutWork.heading}
      </h2>
      <ul role="list" className="ab-work">
        {items.map((project) => (
          <WorkItem key={project.slug} project={project} />
        ))}
      </ul>
      <p className="ab-work-all">
        <Link href="/work" className="ab-pill">
          View all work
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
        </Link>
      </p>
    </section>
  );
}

function WorkItem({ project }: { project: Project }) {
  /* Websites use their portrait (phone) screenshot in these tall cards. */
  const image = project.cover.portrait ?? project.cover;
  const contain = !project.cover.portrait && project.cover.fit === "contain";
  const live = project.links?.live;
  return (
    <li className="ab-work-item" data-ab-rise>
      <div className="ab-work-media" data-fit={project.cover.fit} style={{ backgroundColor: project.cover.backdrop?.color }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 768px) 30vw, 90vw"
          className={contain ? "ab-work-img ab-work-img-contain" : "ab-work-img"}
          style={{ objectPosition: image.position ?? "50% 0%" }}
        />
      </div>
      <h3 className="ab-work-title">{project.title}</h3>
      <p className="ab-work-meta">{project.category}</p>
      {project.credits?.map((credit) => (
        <p key={credit.name} className="ab-work-meta">
          {credit.role} by {credit.name}
          {credit.relation === "collaborator" ? " (collaborator)" : ""}
        </p>
      ))}
      <p className="ab-work-links">
        {live ? (
          <a href={live} target="_blank" rel="noopener noreferrer" className="ab-link">
            Visit website<span className="sr-only">: {project.title} (opens in a new tab)</span>
          </a>
        ) : null}
        <Link href={`/work#${project.slug}`} className="ab-link">
          View in work<span className="sr-only">: {project.title}</span>
        </Link>
      </p>
    </li>
  );
}

function Values() {
  return (
    <section className="ab-section" aria-labelledby="ab-values">
      <SectionLabel number="06" label="What matters to us" />
      <h2 id="ab-values" className="sr-only">
        What matters to us
      </h2>
      <ul role="list" className="ab-rows">
        {aboutValues.map((value, i) => (
          <li key={value.title} className="ab-row ab-row-value" data-ab-rise>
            <p className="ab-row-index">0{i + 1}</p>
            <p className="ab-row-title">{value.title}</p>
            <p className="ab-row-text">{value.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
