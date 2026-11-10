"use client";

import { useEffect, type RefObject } from "react";

/*
 * One playback policy for every <video>/<audio> on the site:
 *
 *   - Only one audible player at a time: when one starts (or is unmuted
 *     while playing), every other audible player pauses. Muted previews
 *     may play alongside, since they make no sound.
 *   - Leaving the route (client navigation, Back/Forward), hiding the tab
 *     or leaving the site pauses everything. Nothing resumes by itself
 *     afterwards; the visitor presses Play again.
 *
 * Hiding a player is not enough: Next keeps the previous route mounted
 * but hidden (React Activity), and a hidden <video> keeps playing. So
 * players also pause themselves when their component is hidden or
 * unmounted (usePauseOnHide), and the layout guard (MediaGuard) pauses
 * any that are left.
 */

function playingMedia(): HTMLMediaElement[] {
  return [...document.querySelectorAll<HTMLMediaElement>("video, audio")].filter((media) => !media.paused);
}

/** Pause every playing media element, except `keep`. */
export function pauseAllMedia(keep?: HTMLMediaElement | null) {
  for (const media of playingMedia()) {
    if (media !== keep) media.pause();
  }
}

/** Pause every other audible player when `media` becomes audible. */
export function claimAudio(media: HTMLMediaElement) {
  if (media.paused || media.muted || media.volume === 0) return;
  for (const other of playingMedia()) {
    if (other !== media && !other.muted && other.volume > 0) other.pause();
  }
}

/**
 * Pause the element when its component unmounts or is hidden (React runs
 * effect cleanups for a hidden Activity, but keeps its DOM).
 */
export function usePauseOnHide(ref: RefObject<HTMLMediaElement | null>) {
  useEffect(() => {
    const media = ref.current;
    return () => media?.pause();
  }, [ref]);
}
