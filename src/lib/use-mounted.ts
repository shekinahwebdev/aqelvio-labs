"use client";

import { useEffect, useState } from "react";

/** False on the server and on the first client render (matches SSR). */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Intro motion must start after hydration so SSR markup matches the first client paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional mount gate
    setMounted(true);
  }, []);

  return mounted;
}
