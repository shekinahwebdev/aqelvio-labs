"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { stayOnSamePage } from "@/lib/in-page";

/*
 * A footer navigation link. Another page: ordinary Next navigation (the new
 * page shows from its top; Back/Forward behave as usual). The page already
 * showing: no navigation; it glides to the top, or to the #section, and
 * moves focus there (see stayOnSamePage). Modified clicks are left to the
 * browser.
 */
export function FooterLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={className} onClick={(event) => stayOnSamePage(event)}>
      {children}
    </Link>
  );
}
