"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play, TriangleAlert } from "lucide-react";
import { previewVideo, type Project } from "@/data/projects";
import { usePauseOnHide } from "@/lib/media-playback";

const MOTION = "(prefers-reduced-motion: no-preference)";
/* The frame is 90vw wide in every layout that shows it large. */
const SIZES = "90vw";

/*
 * A panel's cover: the image (art-directed for portrait viewports when the
 * project has a portrait image), an optional backdrop around contained
 * artwork, and an optional muted preview video.
 *
 * The <img> is lazy, so covers further down the page are not fetched on
 * load; the video is preload="none" and only requested once it plays.
 */
export function ProjectCover({ project, suspended }: { project: Project; suspended: boolean }) {
  const { cover } = project;
  const { props: img } = getImageProps({ src: cover.src, alt: cover.alt, fill: true, sizes: SIZES });
  const portraitSet = cover.portrait
    ? getImageProps({ src: cover.portrait.src, alt: "", fill: true, sizes: SIZES }).props.srcSet
    : undefined;
  const video = previewVideo(project);

  const style = {
    "--rp-pos": cover.position ?? "50% 50%",
    "--rp-pos-portrait": cover.portrait?.position ?? cover.position ?? "50% 50%",
    backgroundColor: cover.backdrop?.color,
  } as CSSProperties;

  return (
    <div
      className="rp-cover"
      data-fit={cover.fit}
      data-portrait-fit={cover.portraitFit ?? cover.fit}
      style={style}
    >
      {cover.backdrop?.image ? (
        <div
          className="rp-backdrop"
          aria-hidden="true"
          style={{ backgroundImage: `url(${cover.backdrop.image})` }}
        />
      ) : null}
      <div className="rp-art">
        <picture>
          {portraitSet ? <source media="(orientation: portrait)" srcSet={portraitSet} sizes={SIZES} /> : null}
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
          <img {...img} className="rp-cover-img" />
        </picture>
        {video ? <PreviewVideo src={video.src} title={project.title} suspended={suspended} /> : null}
      </div>
    </div>
  );
}

type Intent = "auto" | "play" | "pause";

/*
 * Muted, inline, looping preview. It plays only while the panel is on
 * screen, and only on its own when motion is allowed; with reduced motion
 * the poster (the cover image beneath) stays until the visitor presses Play.
 *
 * Once it stops for any reason (scrolled out of view, the panel filtered
 * out, the tab hidden, the page left, the Pause button), it stays paused
 * until the visitor presses Play: returning never restarts it by itself.
 */
function PreviewVideo({ src, title, suspended }: { src: string; title: string; suspended: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [motionOK, setMotionOK] = useState(false);
  const [intent, setIntent] = useState<Intent>("auto");
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  usePauseOnHide(ref);

  useEffect(() => {
    const query = window.matchMedia(MOTION);
    const sync = () => setMotionOK(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const video = ref.current;
    /* The panel whose visibility gates playback (homepage or Work page). */
    const frame = video?.closest(".rp-panel, [data-preview-root]");
    if (!video || !frame) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const shouldPlay = visible && !suspended && (intent === "play" || (intent === "auto" && motionOK));

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (shouldPlay) {
      /* Autoplay may be refused (e.g. power saving): the Play button stays. */
      video.play().catch(() => setPlaying(false));
    } else if (!video.paused) {
      video.pause();
    }
  }, [shouldPlay]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (playing) {
      setIntent("pause");
      return;
    }
    setIntent("play");
    setFailed(false);
    video.play().catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true);
    });
  };

  const label = failed
    ? `Preview could not play, try again: ${title}`
    : `${playing ? "Pause" : "Play"} preview: ${title}`;

  return (
    <>
      <video
        ref={ref}
        className="rp-video"
        data-started={started || undefined}
        src={src}
        muted
        playsInline
        loop
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => {
          setPlaying(true);
          setStarted(true);
          setFailed(false);
        }}
        onPause={() => {
          setPlaying(false);
          /* Whatever stopped it, it waits for an explicit Play. */
          setIntent("pause");
        }}
        onError={() => setFailed(true)}
      />
      <button
        type="button"
        className="rp-play"
        data-failed={failed || undefined}
        aria-label={label}
        title={label}
        onClick={toggle}
      >
        {failed ? (
          <TriangleAlert aria-hidden="true" size={18} />
        ) : playing ? (
          <Pause aria-hidden="true" size={18} />
        ) : (
          <Play aria-hidden="true" size={18} />
        )}
      </button>
      <span className="rp-play-note" role="status">
        {failed ? (
          <>
            Preview could not play<span className="sr-only">: {title}</span>
          </>
        ) : null}
      </span>
    </>
  );
}
