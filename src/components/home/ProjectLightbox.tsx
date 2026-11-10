"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { getLenis } from "@/lib/smooth-scroll";
import type { Project } from "@/data/projects";

/* Keys that would scroll the page behind the dialog. */
const SCROLL_KEYS = new Set(["PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown", " "]);

/*
 * "View Project": the project's artwork or video, full size, in a native
 * modal <dialog>. The browser makes the rest of the page inert and keeps
 * focus inside; Escape closes it (the dialog's own cancel), as do the
 * Close button and a click on the backdrop. Focus returns to the control
 * that opened it. Media is only rendered while open, so nothing here is
 * downloaded until a visitor asks for it.
 */
export function ProjectLightbox({
  project,
  onClose,
  startIndex = 0,
}: {
  project: Project | null;
  onClose: () => void;
  /** Which gallery item to open on (e.g. the image that was enlarged). */
  startIndex?: number;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /* Steps taken from `startIndex` since opening. */
  const [offset, setOffset] = useState(0);

  const shown = project;
  const items = shown?.gallery ?? [];
  const index = items.length ? (((startIndex + offset) % items.length) + items.length) % items.length : 0;
  const item = items[index];
  const many = items.length > 1;

  /* Open / close the dialog with the selected project. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !project) return;

    openerRef.current = document.activeElement as HTMLElement | null;
    dialog.showModal();
    closeRef.current?.focus();

    /* Hold the page still: stop smooth scrolling and block native scroll
       input (wheel, touch, keys), which a modal dialog does not stop. */
    getLenis()?.stop();
    const block = (event: Event) => event.preventDefault();
    const keys = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      /* Keep Tab inside the dialog rather than letting it reach the
         browser's own controls. */
      if (event.key === "Tab") {
        const focusables = [...dialog.querySelectorAll<HTMLElement>("button, a[href], video[controls]")];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
        return;
      }
      if (target.closest("video")) return;
      if (event.key === " " && target.closest("button")) return;
      if (SCROLL_KEYS.has(event.key)) event.preventDefault();
    };
    dialog.addEventListener("wheel", block, { passive: false });
    dialog.addEventListener("touchmove", block, { passive: false });
    dialog.addEventListener("keydown", keys);

    const closed = () => {
      /* Silence at once, before React removes the player. */
      dialog.querySelectorAll("video").forEach((video) => video.pause());
      setOffset(0);
      onClose();
    };
    dialog.addEventListener("close", closed);

    return () => {
      dialog.removeEventListener("wheel", block);
      dialog.removeEventListener("touchmove", block);
      dialog.removeEventListener("keydown", keys);
      dialog.removeEventListener("close", closed);
      if (dialog.open) dialog.close();
      getLenis()?.start();
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [project, onClose]);

  const step = (by: number) => setOffset((o) => o + by);

  return (
    <dialog
      ref={dialogRef}
      className="rp-lightbox"
      aria-labelledby="rp-lightbox-title"
      aria-describedby="rp-lightbox-meta"
      onClick={(event) => {
        /* A click on the empty area around the media (not on the media,
           the text or a control) closes, like clicking a backdrop. */
        const target = event.target as HTMLElement;
        if (target === event.currentTarget || target.matches(".rp-lightbox-inner, .rp-lightbox-stage")) {
          dialogRef.current?.close();
        }
      }}
      onKeyDown={(event) => {
        if (!many || (event.target as HTMLElement).closest("video")) return;
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
    >
      {shown && item ? (
        <div className="rp-lightbox-inner">
          <header className="rp-lightbox-head">
            <div>
              <h2 id="rp-lightbox-title" className="rp-lightbox-title">
                {shown.title}
              </h2>
              <p id="rp-lightbox-meta" className="rp-lightbox-meta">
                {shown.category}
                {shown.credits?.map((credit) => (
                  <span key={credit.name}>
                    {" · "}
                    {credit.role} by {credit.name}
                    {credit.relation === "collaborator" ? " (collaborator)" : null}
                    {credit.relation === "credited" ? " (as credited on the artwork)" : null}
                  </span>
                ))}
              </p>
            </div>
            <button
              type="button"
              className="rp-lightbox-btn"
              aria-label="Close"
              ref={closeRef}
              onClick={() => dialogRef.current?.close()}
            >
              <X aria-hidden="true" size={20} />
            </button>
          </header>

          <figure className="rp-lightbox-stage">
            {item.type === "image" ? (
              <Image
                key={item.src}
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="rp-lightbox-media"
                loading="eager"
              />
            ) : (
              <VideoPlayer
                key={item.src}
                className="rp-lightbox-media rp-lightbox-video"
                src={item.src}
                poster={item.poster}
                width={item.width}
                height={item.height}
                label={item.label}
                title={shown.title}
                preload="metadata"
              />
            )}
          </figure>

          {many ? (
            <nav className="rp-lightbox-nav" aria-label="Project images">
              <button type="button" className="rp-lightbox-btn" aria-label="Previous image" onClick={() => step(-1)}>
                <ChevronLeft aria-hidden="true" size={20} />
              </button>
              <p aria-live="polite" className="rp-lightbox-count">
                {index + 1} / {items.length}
              </p>
              <button type="button" className="rp-lightbox-btn" aria-label="Next image" onClick={() => step(1)}>
                <ChevronRight aria-hidden="true" size={20} />
              </button>
            </nav>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
