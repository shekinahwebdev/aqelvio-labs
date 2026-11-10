"use client";

import { getHeroSocialDisplay } from "@/config/hero-social";
import { cn } from "@/lib/utils";

type HeroSocialRailProps = {
  className?: string;
  /** `rail`: the desktop column. `compact`: below the hero breakpoint — a row on phones, a column from 480px. */
  layout?: "rail" | "compact";
};

const buttonBase =
  "group flex items-center justify-center rounded-full border border-border bg-elevated-2 text-foreground outline-none transition-[background-color,border-color] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:bg-hover focus-visible:ring-2 focus-visible:ring-focus";

const layouts = {
  rail: {
    root: "hidden flex-col gap-3 hero:flex",
    button: "size-16",
    icon: "size-5",
  },
  compact: {
    root: "flex flex-row gap-3 min-[480px]:flex-col",
    button: "size-[30px] min-[480px]:size-10 md:size-[50px]",
    icon: "size-[15px] min-[480px]:size-[18px] md:size-5",
  },
} as const;

export function HeroSocialRail({ className, layout = "rail" }: HeroSocialRailProps) {
  const items = getHeroSocialDisplay();
  const hasLinks = items.some((item) => item.href);
  const sizes = layouts[layout];
  const buttonClassName = cn(buttonBase, sizes.button);

  return (
    <div
      className={cn(
        "hero-rail",
        sizes.root,
        hasLinks ? "pointer-events-auto" : "pointer-events-none",
        className,
      )}
      aria-hidden={!hasLinks}
    >
      {items.map((item) => {
        const Icon = item.icon;
        if (item.href) {
          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className={buttonClassName}
            >
              <Icon className={sizes.icon} />
            </a>
          );
        }

        return (
          <div key={item.id} className={buttonClassName}>
            <Icon className={sizes.icon} />
          </div>
        );
      })}
    </div>
  );
}
