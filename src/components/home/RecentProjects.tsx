"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { featuredProjects, projectHref, projectMotion, recentProjectsIntro, type Project } from "@/data/projects";
import { ProjectCover } from "@/components/home/ProjectCover";

/*
 * "A Few Of Our Recent Projects": an introduction, then one viewport-tall
 * panel per project, rebuilt from the motion reference's Works list (see
 * projectMotion for what was measured). Per panel:
 *
 *   .rp-panel   one viewport tall; the ScrollTrigger target
 *   .rp-frame   the image frame; its clip-path is scrubbed open and shut
 *   .rp-title   the repeated title on a shallow arch, slid along it with
 *               scroll (decorative, aria-hidden; the <h3> names it once)
 *   .rp-link    "View Project", covering the frame: opens the project's
 *               page. Its tag follows the pointer on hover and sits still
 *               on touch and for keyboard focus.
 *
 * Everything scroll-driven is scrubbed, so stopping stops it and scrolling
 * back reverses it. All of it lives in one gsap.matchMedia context that is
 * reverted on unmount; nothing here touches other sections.
 *
 * Reduced motion / no JS: no [data-rp="scroll"], so panels sit in normal
 * flow at a fixed aspect ratio, titles hold still and nothing is clipped.
 */
const MOTION = "(prefers-reduced-motion: no-preference)";
const FOLLOW = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function RecentProjects() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const heading = section.querySelector<HTMLElement>(".rp-heading")!;
    const chars = [...section.querySelectorAll<HTMLElement>(".rp-char")];
    const aside = section.querySelector<HTMLElement>(".rp-aside")!;
    const panels = [...section.querySelectorAll<HTMLElement>(".rp-panel")];
    const { clip, title, tag } = projectMotion;

    const mm = gsap.matchMedia();

    mm.add(MOTION, () => {
      section.dataset.rp = "scroll";

      /* The reference's title reveal: characters rise from 3× their height
         and fade in, staggered from the centre, scrubbed. */
      gsap.timeline({
        scrollTrigger: { trigger: heading, start: "top bottom", end: "center center-=25%", scrub: true },
      }).from(chars, { yPercent: 300, autoAlpha: 0, ease: "sine", stagger: { each: 0.04, from: "center" } });

      /* Its supporting blocks blur in once. */
      gsap.from(aside, {
        filter: "blur(16px)",
        opacity: 0,
        scrollTrigger: { trigger: aside, start: "top 70%", once: true },
      });

      panels.forEach((panel) => {
        const frame = panel.querySelector<HTMLElement>(".rp-frame")!;
        gsap.set(frame, { clipPath: clip.enter, willChange: "clip-path" });
        const shape = gsap
          .timeline({ defaults: { ease: "none" } })
          .to(frame, { clipPath: clip.open })
          .to(frame, { clipPath: clip.exit });
        ScrollTrigger.create({
          trigger: panel,
          start: "top bottom",
          end: "bottom top",
          scrub: clip.scrub,
          animation: shape,
          invalidateOnRefresh: true,
        });

        const textPath = panel.querySelector<SVGTextPathElement>(".rp-title textPath")!;
        const path = panel.querySelector<SVGPathElement>(".rp-title path")!;
        const travel = Math.round(path.getTotalLength() * title.travel);
        gsap.fromTo(
          textPath,
          { attr: { startOffset: 0 } },
          {
            attr: { startOffset: -travel },
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: `+=${title.distance}`, scrub: title.scrub },
          },
        );
      });

      return () => {
        delete section.dataset.rp;
      };
    });

    /* "View Work" follows a fine pointer; keyboard focus centres it. */
    mm.add(FOLLOW, () => {
      section.dataset.rpTag = "follow";
      const offs: (() => void)[] = [];

      section.querySelectorAll<HTMLElement>(".rp-link").forEach((link) => {
        const label = link.querySelector<HTMLElement>(".rp-tag")!;
        gsap.set(label, { left: 0, top: 0, xPercent: -50, yPercent: -50, opacity: 0 });
        const xTo = gsap.quickTo(label, "x", { duration: tag.follow, ease: tag.ease });
        const yTo = gsap.quickTo(label, "y", { duration: tag.follow, ease: tag.ease });
        const centre = () => gsap.set(label, { x: link.offsetWidth / 2, y: link.offsetHeight / 2 });
        const show = () => gsap.to(label, { opacity: 1, duration: tag.fade, overwrite: "auto" });
        const hide = () => gsap.to(label, { opacity: 0, duration: tag.fade, overwrite: "auto" });

        const enter = () => {
          centre();
          show();
        };
        const move = (event: PointerEvent) => {
          const rect = link.getBoundingClientRect();
          xTo(event.clientX - rect.left);
          yTo(event.clientY - rect.top);
        };
        const focus = () => {
          if (link.matches(":focus-visible")) {
            centre();
            show();
          }
        };
        const leave = () => {
          if (!link.matches(":focus-visible")) hide();
        };

        link.addEventListener("pointerenter", enter);
        link.addEventListener("pointermove", move);
        link.addEventListener("pointerleave", leave);
        link.addEventListener("focus", focus);
        link.addEventListener("blur", hide);
        offs.push(() => {
          link.removeEventListener("pointerenter", enter);
          link.removeEventListener("pointermove", move);
          link.removeEventListener("pointerleave", leave);
          link.removeEventListener("focus", focus);
          link.removeEventListener("blur", hide);
        });
      });

      return () => {
        offs.forEach((off) => off());
        delete section.dataset.rpTag;
      };
    });

    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

    return () => {
      alive = false;
      mm.revert();
    };
  }, []);

  const [lead, trail] = recentProjectsIntro.heading;
  const arrow = <ArrowUpRight aria-hidden="true" strokeWidth={1.25} className="rp-arrow" />;

  return (
    <section ref={sectionRef} id="recent-projects" aria-labelledby="recent-projects-heading" className="rp">
      <Container className="rp-intro">
        <h2 id="recent-projects-heading" className="rp-heading">
          <span className="sr-only">{`${lead} ${trail}`}</span>
          {[lead, trail].map((line) => (
            <span key={line} className="rp-line" aria-hidden="true">
              {[...line].map((char, i) => (
                <span key={i} className="rp-char">
                  {char === " " ? " " : char}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <div className="rp-aside">
          {recentProjectsIntro.href ? (
            <Link href={recentProjectsIntro.href} aria-label="All projects" className="rp-arrow-link">
              {arrow}
            </Link>
          ) : (
            arrow
          )}
          <p className="rp-body">{recentProjectsIntro.body}</p>
        </div>
      </Container>

      <ul role="list" className="rp-list">
        {featuredProjects.map((project) => {
          const titleId = `project-${project.slug}`;
          const repeated = Array.from({ length: projectMotion.title.repeats }, () => project.title).join("   ");
          return (
            <li key={project.slug} className="rp-panel" aria-labelledby={titleId}>
              <h3 id={titleId} className="sr-only">
                {project.title}
              </h3>

              <div className="rp-frame">
                <ProjectCover project={project} suspended={false} />
                <ProjectAction project={project} />

                <p className="rp-meta">
                  <span>{project.category}</span>
                  {project.status ? (
                    <>
                      <span className="rp-meta-sep" aria-hidden="true" />
                      <span>{project.status}</span>
                    </>
                  ) : null}
                  {project.credits?.map((credit) => (
                    <span key={credit.name} className="rp-chip">
                      {credit.relation === "collaborator" ? <span className="sr-only">Collaborator: </span> : null}
                      {credit.role} by {credit.name}
                    </span>
                  ))}
                  {project.cover.concept ? <span className="rp-chip">Concept visual</span> : null}
                </p>
              </div>

              <svg
                className="rp-title"
                viewBox={projectMotion.viewBox}
                aria-hidden="true"
                focusable="false"
                style={
                  {
                    "--rp-title-color": project.titleTreatment.color,
                    mixBlendMode: project.titleTreatment.blend,
                  } as CSSProperties
                }
              >
                <defs>
                  <path id={`${titleId}-path`} d={projectMotion.path} />
                </defs>
                <text>
                  <textPath href={`#${titleId}-path`} startOffset="0">
                    {repeated}
                  </textPath>
                </text>
              </svg>
            </li>
          );
        })}
      </ul>

    </section>
  );
}

/* Every panel opens the project's own page (its live website, where there
   is one, is linked from there). */
function ProjectAction({ project }: { project: Project }) {
  return (
    <Link href={project.links?.caseStudy ?? projectHref(project)} className="rp-link" aria-label={`View project: ${project.title}`}>
      <span className="rp-tag">View Project</span>
    </Link>
  );
}
