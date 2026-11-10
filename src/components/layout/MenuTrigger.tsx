"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type MenuTriggerProps = {
  open: boolean;
  onClick: () => void;
  className?: string;
  tabIndex?: number;
  controlsMenu?: boolean;
  "aria-hidden"?: boolean;
};

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  function MenuTrigger(
    {
      open,
      onClick,
      className,
      tabIndex,
      controlsMenu = true,
      "aria-hidden": ariaHidden,
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        tabIndex={tabIndex}
        aria-hidden={ariaHidden}
        aria-expanded={controlsMenu ? open : undefined}
        aria-controls={controlsMenu ? "site-menu" : undefined}
        aria-label={open ? "Close navigation" : "Open navigation"}
        data-menu-close={open ? true : undefined}
        className={cn(
          "group relative inline-flex h-14 min-w-[8.5rem] items-center justify-center gap-3.5 rounded-full border border-border bg-elevated-2 px-6 text-base tracking-[-0.02em] text-foreground outline-none transition-[background-color,border-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
          "hover:bg-hover",
          "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
      >
        <span
          className="relative flex h-3.5 w-4 flex-col justify-center"
          aria-hidden="true"
        >
          <span
            className={cn(
              "absolute left-0 h-px w-full bg-foreground transition-transform duration-300 ease-[var(--ease-out)]",
              open ? "translate-y-0 rotate-45" : "-translate-y-[4px]",
            )}
          />
          <span
            className={cn(
              "absolute left-0 h-px w-full bg-foreground transition-transform duration-300 ease-[var(--ease-out)]",
              open ? "translate-y-0 -rotate-45" : "translate-y-[4px]",
            )}
          />
        </span>
        <span className="relative w-[4.15rem] overflow-hidden text-left">
          <span
            className={cn(
              "block transition-transform duration-300 ease-[var(--ease-out)]",
              open ? "-translate-y-full" : "translate-y-0",
            )}
          >
            Menu
          </span>
          <span
            className={cn(
              "absolute inset-0 block transition-transform duration-300 ease-[var(--ease-out)]",
              open ? "translate-y-0" : "translate-y-full",
            )}
          >
            Close
          </span>
        </span>
      </button>
    );
  },
);
