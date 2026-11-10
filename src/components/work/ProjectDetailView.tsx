"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowUpRight, Maximize2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectLightbox } from "@/components/home/ProjectLightbox";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { projectHref, type Project, type ProjectDetail, type ProjectMedia } from "@/data/projects";

/*
 * A project's own page, after the reference (Origin Studio /works/gravity,
 * read live at 1440×900 and 390×844): a centred introduction (large title,
 * short description, a metadata row of small uppercase labels over fine
 * rules), a cover at about 80% of the width, then editorial sections with
 * large light headings and grey text, full-width media and image pairs.
 *
 * Motion, as the reference: the title's letters un-blur in on load (CSS, so
 * there is no flash before hydration); blocks blur and fade in once as they
 * enter. No parallax. Reduced motion / no JS: everything static.
 *
 * Only what the dataset holds is shown: no empty metadata or sections.
 */
const MOTION = "(prefers-reduced-motion: no-preference)";

type Props = { project: Project; detail: ProjectDetail; next: Project };

export function ProjectDetailView({ project, detail, next }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [viewer, setViewer] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const tweens = new Map<Element, gsap.core.Tween>();
      root.querySelectorAll<HTMLElement>("[data-pd-in]").forEach((el) => {
        tweens.set(
          el,
          gsap.from(el, {
            opacity: 0,
            filter: "blur(16px)",
            y: 24,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "filter",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
        );
      });
      /* Keyboard focus never lands on a block that has not appeared yet. */
      const onFocus = (event: FocusEvent) => {
        const block = (event.target as HTMLElement).closest("[data-pd-in]");
        if (block) tweens.get(block)?.progress(1);
      };
      root.addEventListener("focusin", onFocus);
      return () => root.removeEventListener("focusin", onFocus);
    });
    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());
    return () => {
      alive = false;
      mm.revert();
    };
  }, []);

  const meta = [
    detail.brand ? { label: "Brand", value: detail.brand } : null,
    detail.type ? { label: "Type", value: detail.type } : null,
    { label: "Service", value: project.category },
    ...(project.credits ?? []).map((credit) => ({
      label: "Credit",
      value: `${credit.role} by ${credit.name}${credit.relation === "collaborator" ? " (collaborator)" : ""}${credit.relation === "credited" ? " (as credited on the artwork)" : ""}`,
    })),
    project.status ? { label: "Status", value: project.status } : null,
    detail.date ? { label: "Date", value: detail.date } : null,
  ].filter((item): item is { label: string; value: string } => item !== null);

  const gallery = project.gallery ?? [];
  const live = project.links?.live;

  return (
    <article ref={rootRef} className="pd" aria-labelledby="pd-title">
      <header className="pd-intro">
        <Link href="/work" className="pd-back">
          <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.75} />
          Back to Work
        </Link>
        <h1 id="pd-title" className="pd-title">
          <span className="sr-only">{project.title}</span>
          <span aria-hidden="true">
            {project.title.split(" ").map((word, w, words) => {
              const offset = words.slice(0, w).join("").length;
              return (
                <span key={w}>
                  {w ? " " : null}
                  <span className="pd-word">
                    {[...word].map((char, c) => (
                      <span key={c} className="pd-char" style={{ "--i": offset + c } as CSSProperties}>
                        {char}
                      </span>
                    ))}
                  </span>
                </span>
              );
            })}
          </span>
        </h1>
        <p className="pd-lede">{detail.intro}</p>
        <dl className="pd-meta">
          {meta.map((item) => (
            <div key={item.label + item.value} className="pd-meta-item">
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <Cover project={project} />

      <div className="pd-body">
        <section className="pd-section" aria-labelledby="pd-overview" data-pd-in>
          <h2 id="pd-overview" className="pd-heading">
            Project Overview
          </h2>
          <div className="pd-text">
            {detail.overview.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
          {live ? (
            <p className="pd-live">
              <a href={live} target="_blank" rel="noopener noreferrer" className="pd-pill">
                Visit Website
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.75} />
                <span className="sr-only">: {project.title} (opens in a new tab)</span>
              </a>
            </p>
          ) : null}
        </section>

        <ListSection id="pd-objectives" title="Objectives" items={detail.objectives} />
        <ListSection id="pd-approach" title="Approach" items={detail.approach} />

        {gallery.length ? (
          <section className="pd-section pd-gallery-section" aria-labelledby="pd-gallery">
            <h2 id="pd-gallery" className="pd-heading" data-pd-in>
              {gallery.length > 1 ? "Selected Work" : "The Work"}
            </h2>
            <Gallery project={project} onEnlarge={(index) => setViewer({ open: true, index })} />
          </section>
        ) : null}

        <ListSection id="pd-deliverables" title="Deliverables" items={detail.deliverables} />
      </div>

      <nav className="pd-next" aria-label="More work">
        <Link href="/work" className="pd-back pd-back-end">
          <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.75} />
          Back to Work
        </Link>
        <Link href={projectHref(next)} className="pd-next-card">
          <span className="pd-next-label">Next project</span>
          <span className="pd-next-title">{next.title}</span>
          <span className="pd-next-media" aria-hidden="true" style={{ backgroundColor: next.cover.backdrop?.color }}>
            <Image
              src={next.cover.src}
              alt=""
              fill
              sizes="(min-width: 768px) 60vw, 90vw"
              className={next.cover.fit === "contain" ? "pd-next-img pd-next-img-contain" : "pd-next-img"}
              style={{ objectPosition: next.cover.position ?? "50% 0%" }}
            />
          </span>
        </Link>
      </nav>

      <ProjectLightbox
        project={viewer.open ? project : null}
        startIndex={viewer.index}
        onClose={() => setViewer((v) => ({ ...v, open: false }))}
      />
    </article>
  );
}

function ListSection({ id, title, items }: { id: string; title: string; items?: readonly string[] }) {
  if (!items?.length) return null;
  return (
    <section className="pd-section" aria-labelledby={id} data-pd-in>
      <h2 id={id} className="pd-heading">
        {title}
      </h2>
      <ul className="pd-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

/* The cover: website screenshots whole in a browser frame over their own
   blurred colours; finished artwork whole over a blurred copy of itself;
   photographic covers (video frames) fill the frame. */
function Cover({ project }: { project: Project }) {
  const cover = { ...project.cover, ...project.workCover };
  const backdrop = cover.backdrop?.image;
  const style = { backgroundColor: cover.backdrop?.color } as CSSProperties;

  if (cover.frame) {
    return (
      <figure className="pd-cover pd-cover-framed" style={style}>
        {backdrop ? <div className="pd-backdrop" style={{ backgroundImage: `url(${backdrop})` }} aria-hidden="true" /> : null}
        <div className="pd-browser pd-browser-desktop">
          <Image src={project.cover.src} alt={project.cover.alt} fill preload sizes="(min-width: 768px) 64vw, 90vw" className="pd-img-top" />
        </div>
        {project.cover.portrait ? (
          <div className="pd-browser pd-browser-phone">
            <Image src={project.cover.portrait.src} alt={project.cover.portrait.alt} fill preload sizes="60vw" className="pd-img-top" />
          </div>
        ) : null}
      </figure>
    );
  }

  if (cover.fit === "contain") {
    return (
      <figure className="pd-cover pd-cover-contain" style={style}>
        {backdrop ? <div className="pd-backdrop" style={{ backgroundImage: `url(${backdrop})` }} aria-hidden="true" /> : null}
        <div className="pd-cover-art">
          <Image src={cover.src} alt={cover.alt} fill preload sizes="80vw" className="pd-img-contain" />
        </div>
      </figure>
    );
  }

  return (
    <figure className="pd-cover" style={style}>
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        preload
        sizes="80vw"
        className="pd-img-cover"
        style={{ objectPosition: cover.position ?? "50% 50%" }}
      />
    </figure>
  );
}

/* Landscape media and videos run full width; portrait and square artwork
   sits in pairs (or alone, centred) so it is always seen whole. */
function Gallery({ project, onEnlarge }: { project: Project; onEnlarge: (index: number) => void }) {
  const items = (project.gallery ?? []).map((media, index) => ({ media, index }));
  const rows: { kind: "full" | "pair" | "single"; items: typeof items }[] = [];
  let pending: typeof items = [];
  const flush = () => {
    if (pending.length) rows.push({ kind: pending.length === 2 ? "pair" : "single", items: pending });
    pending = [];
  };
  for (const entry of items) {
    const wide = entry.media.type === "video" || entry.media.width / entry.media.height > 1.25;
    if (wide) {
      flush();
      rows.push({ kind: "full", items: [entry] });
    } else {
      pending.push(entry);
      if (pending.length === 2) flush();
    }
  }
  flush();

  const backdrop = project.cover.backdrop?.color ?? "#111";
  return (
    <div className="pd-gallery">
      {rows.map((row, r) => (
        <div key={r} className={`pd-row pd-row-${row.kind}`} data-pd-in>
          {row.items.map(({ media, index }) => (
            <MediaTile key={index} media={media} index={index} backdrop={backdrop} title={project.title} onEnlarge={onEnlarge} />
          ))}
        </div>
      ))}
    </div>
  );
}

function MediaTile({
  media,
  index,
  backdrop,
  title,
  onEnlarge,
}: {
  media: ProjectMedia;
  index: number;
  backdrop: string;
  title: string;
  onEnlarge: (index: number) => void;
}) {
  if (media.type === "video") {
    return (
      <figure className="pd-tile pd-tile-video" style={{ aspectRatio: `${media.width} / ${media.height}` }}>
        <VideoPlayer
          className="pd-video"
          src={media.src}
          poster={media.poster}
          width={media.width}
          height={media.height}
          label={media.label}
          title={title}
        />
      </figure>
    );
  }
  const landscape = media.width / media.height > 1.25;
  return (
    <figure
      className={landscape ? "pd-tile pd-tile-wide" : "pd-tile pd-tile-tall"}
      style={{ aspectRatio: landscape ? `${media.width} / ${media.height}` : undefined, backgroundColor: backdrop }}
    >
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes={landscape ? "(min-width: 768px) 80vw, 92vw" : "(min-width: 768px) 40vw, 92vw"}
        className={landscape ? "pd-img-cover" : "pd-img-contain pd-img-pad"}
      />
      <button type="button" className="pd-enlarge" aria-haspopup="dialog" onClick={() => onEnlarge(index)}>
        <Maximize2 aria-hidden="true" size={16} strokeWidth={1.75} />
        <span className="sr-only">
          Enlarge image {index + 1}: {title}
        </span>
      </button>
    </figure>
  );
}
