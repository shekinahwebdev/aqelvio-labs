"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const subscribe = () => () => {};

/**
 * Defers pathname-dependent UI until the client has hydrated so
 * Cache Components prerender does not mismatch active-route classes.
 */
export function useCurrentPath(): string | null {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  if (!mounted) {
    return null;
  }

  return pathname ?? "/";
}
