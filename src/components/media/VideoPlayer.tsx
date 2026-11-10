"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { usePauseOnHide } from "@/lib/media-playback";

type Props = {
  src: string;
  /** A real frame from the video, shown until it plays. */
  poster: string;
  width: number;
  height: number;
  /** Accessible name for the video. */
  label: string;
  /** Short name used on the Play button ("Play video: …"). */
  title: string;
  /** Sizing / positioning class for the player box. */
  className?: string;
  preload?: "none" | "metadata";
};

/*
 * A video with sound and native controls (play/pause, seek, mute, volume,
 * fullscreen, keyboard), and a large Play button over the poster until it
 * first plays, so the poster clearly reads as a video. A failed load or a
 * rejected play request is said on screen, with the file to open instead.
 *
 * Playback follows the site policy (media-playback.ts): it pauses when its
 * page is left or hidden and when another video with sound starts, and it
 * never resumes on its own.
 */
export function VideoPlayer({ src, poster, width, height, label, title, className, preload = "none" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  usePauseOnHide(ref);

  const play = () => {
    const video = ref.current;
    if (!video) return;
    setProblem(null);
    video.play().then(
      () => video.focus({ preventScroll: true }),
      (error: unknown) => {
        /* A pause during loading (e.g. leaving the page) is not a failure. */
        if (error instanceof DOMException && error.name === "AbortError") return;
        setProblem(
          error instanceof DOMException && error.name === "NotSupportedError"
            ? "The video could not be loaded."
            : "The video could not start.",
        );
      },
    );
  };

  return (
    <div className={className ? `vp ${className}` : "vp"}>
      <video
        ref={ref}
        className="vp-media"
        src={src}
        poster={poster}
        width={width}
        height={height}
        controls
        playsInline
        preload={preload}
        aria-label={label}
        onPlay={() => {
          setStarted(true);
          setProblem(null);
        }}
        onError={() => setProblem("The video could not be loaded.")}
      />
      {!started && !problem ? (
        <button type="button" className="vp-play" onClick={play}>
          <span className="vp-play-icon" aria-hidden="true">
            <Play size={22} fill="currentColor" strokeWidth={0} />
          </span>
          <span className="vp-play-text">
            Play video<span className="sr-only">: {title}</span>
          </span>
        </button>
      ) : null}
      <div className="vp-problem" role="status">
        {problem ? (
          <p>
            {problem}{" "}
            <button type="button" onClick={play}>
              Try again
            </button>{" "}
            or{" "}
            <a href={src} target="_blank" rel="noopener noreferrer">
              open the video file<span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        ) : null}
      </div>
    </div>
  );
}
