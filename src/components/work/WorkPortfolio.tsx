"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectCover } from "@/components/home/ProjectCover";
import {
  activeProjectFilters,
  projectHref,
  workProjects,
  type Project,
  type ProjectFilter,
} from "@/data/projects";
import { getLenis, scrollToElement } from "@/lib/smooth-scroll";
import { previousPath } from "@/lib/route-history";

/*
 * The full portfolio: filters, then one full-width panel per project.
 *
 * Motion, from the reference (Origin Studio works-03, read from its live
 * code and sampled): panels are stacked, one viewport tall, with no
 * pinning. On desktop each image is held still while its panel scrolls
 * over it (the reference's fixed background; here a scroll-linked
 * transform, so images can still lazy-load); phones scroll normally. Each
 * title un-blurs letter by letter, and its category and actions blur in,
 * once, as the panel's text reaches 70% of the viewport. There is no hover
 * motion on the image; hover only emphasises the action.
 *
 * Reduced motion / no JS: static panels, everything visible.
 */
const MOTION = "(prefers-reduced-motion: no-preference)";
const HOLD = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

type Filter = ProjectFilter | "all";

/* Where the visitor was when they opened a project (session only). */
const PLACE_KEY = "aq:work-place";
type Place = { slug: string; y: number; filter: Filter };

function readPlace(): Place | null {
  try {
    const raw = typeof window === "undefined" ? null : sessionStorage.getItem(PLACE_KEY);
    return raw ? (JSON.parse(raw) as Place) : null;
  } catch {
    return null;
  }
}

/** The saved place, but only when arriving straight from that project. */
function returningPlace(): Place | null {
  const place = readPlace();
  return place && previousPath() === `/work/${place.slug}` ? place : null;
}

export function WorkPortfolio() {
  const listRef = useRef<HTMLOListElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  /* Returning from a project page restores the filter that was in use. */
  const [filter, setFilter] = useState<Filter>(() => returningPlace()?.filter ?? "all");
  const changed = useRef(false);

  const shown = workProjects.filter((project) => filter === "all" || project.filter === filter);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    const offs: (() => void)[] = [];

    mm.add(MOTION, () => {
      list.querySelectorAll<HTMLElement>(".wk-panel").forEach((panel) => {
        const text = panel.querySelector<HTMLElement>(".wk-text")!;
        const reveal = gsap
          /* The text sits at the panel's foot, so it reveals as it enters
             (the reference's 70% suited text in mid-panel). */
          .timeline({ scrollTrigger: { trigger: text, start: "top 92%", toggleActions: "play none none none" } })
          .from(panel.querySelectorAll(".wk-char"), {
            filter: "blur(16px)",
            opacity: 0,
            ease: "power2.out",
            duration: 0.5,
            stagger: 0.03,
          })
          .from(panel.querySelectorAll(".wk-in"), { filter: "blur(16px)", opacity: 0, duration: 0.5 }, 0);
        /* Keyboard focus never lands on text that has not arrived yet. */
        const show = () => reveal.progress(1);
        panel.addEventListener("focusin", show);
        offs.push(() => panel.removeEventListener("focusin", show));
      });
      return () => {
        offs.splice(0).forEach((off) => off());
      };
    });

    mm.add(HOLD, () => {
      list.querySelectorAll<HTMLElement>(".wk-panel").forEach((panel) => {
        gsap.fromTo(
          panel.querySelector(".rp-cover"),
          { y: () => -window.innerHeight },
          {
            y: () => window.innerHeight,
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  /* Back from the project opened here: return to the same place. */
  useEffect(() => {
    let timers: number[] = [];
    /* Checked a tick later, once the route tracker has recorded where the
       visitor came from (its effect may run after this one). */
    const check = window.setTimeout(() => {
      const place = returningPlace();
      if (!place) return;
      sessionStorage.removeItem(PLACE_KEY);
      const restore = () => {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(place.y, { immediate: true, force: true });
        else window.scrollTo({ top: place.y, behavior: "instant" });
      };
      /* Repeated while the page settles (images, triggers re-measuring). */
      timers = [0, 150, 450, 900].map((ms) => window.setTimeout(restore, ms));
    }, 0);
    return () => {
      window.clearTimeout(check);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  /* Filtering changes the page height: re-measure every trigger. */
  useEffect(() => {
    if (!changed.current) return;
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [filter]);

  const rememberPlace = (slug: string) => {
    try {
      sessionStorage.setItem(PLACE_KEY, JSON.stringify({ slug, y: window.scrollY, filter } satisfies Place));
    } catch {
      /* Storage unavailable: returning simply starts at the top. */
    }
  };

  const choose = (next: Filter) => {
    changed.current = true;
    setFilter(next);
    /* Deep in the list, bring the (unchanged, still focused) toolbar back. */
    const bar = filtersRef.current;
    if (bar && bar.getBoundingClientRect().top < 0) scrollToElement(bar);
  };

  const count = shown.length;
  const label = filter === "all" ? null : activeProjectFilters.find((item) => item.id === filter)?.label;

  return (
    <section aria-labelledby="work-portfolio-title" className="wk">
      <h2 id="work-portfolio-title" className="sr-only">
        Projects
      </h2>
      {/* Compact filter toolbar, in flow above the collection. */}
      <div ref={filtersRef} className="wk-toolbar">
        <div role="group" aria-label="Filter projects by category" className="wk-filter-row">
          {[{ id: "all" as const, label: "All" }, ...activeProjectFilters].map((item) => (
            <button
              key={item.id}
              type="button"
              className="wk-filter"
              aria-pressed={filter === item.id}
              onClick={() => choose(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p role="status" className="wk-count">
          {count} {count === 1 ? "project" : "projects"}
          {label ? ` in ${label}` : ""}
        </p>
      </div>

      <ol ref={listRef} role="list" className="wk-list">
        {workProjects.map((project) => (
          <WorkPanel
            key={project.slug}
            project={project}
            hidden={!shown.includes(project)}
            onOpen={rememberPlace}
          />
        ))}
      </ol>

    </section>
  );
}

function WorkPanel({
  project,
  hidden,
  onOpen,
}: {
  project: Project;
  hidden: boolean;
  onOpen: (slug: string) => void;
}) {
  const titleId = `work-${project.slug}`;
  const shownProject = project.workCover
    ? { ...project, cover: { ...project.cover, ...project.workCover } }
    : project;
  const { live, caseStudy } = project.links ?? {};
  const credits = project.credits ?? [];

  return (
    <li
      id={project.slug}
      className="wk-panel"
      data-fit={shownProject.cover.fit}
      data-frame={shownProject.cover.frame}
      data-preview-root
      aria-labelledby={titleId}
      hidden={hidden}
    >
      <div className="wk-media">
        <ProjectCover project={shownProject} suspended={hidden} />
        <div className="wk-overlay" aria-hidden="true" />
      </div>

      <div className="wk-text">
        <h3 id={titleId} className="wk-title">
          <span className="sr-only">{project.title}</span>
          <span aria-hidden="true">
            {/* Real spaces between words, so wrapped lines start flush. */}
            {project.title.split(" ").map((word, w) => (
              <span key={w}>
                {w ? " " : null}
                <span className="wk-word">
                  {[...word].map((char, c) => (
                    <span key={c} className="wk-char">
                      {char}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </span>
        </h3>

        <div className="wk-in wk-meta">
          <span className="wk-badge">{project.category}</span>
          {project.status ? <span className="wk-status">{project.status}</span> : null}
          {project.cover.concept ? <span className="wk-status">Concept visual</span> : null}
        </div>

        {credits.length ? (
          <p className="wk-in wk-credit">
            {credits.map((credit, i) => (
              <span key={credit.name}>
                {i ? " · " : ""}
                {credit.role} by {credit.name}
                {credit.relation === "collaborator" ? " (collaborator)" : ""}
                {credit.relation === "credited" ? " (as credited on the artwork)" : ""}
              </span>
            ))}
          </p>
        ) : null}

        <div className="wk-in wk-actions">
          <Link
            href={caseStudy ?? projectHref(project)}
            className="wk-btn wk-btn-primary"
            onClick={() => onOpen(project.slug)}
          >
            View Project<span className="sr-only">: {project.title}</span>
          </Link>
          {live ? (
            <a href={live} target="_blank" rel="noopener noreferrer" className="wk-btn">
              Visit Website
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
              <span className="sr-only">: {project.title} (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}
