"use client";

import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { navigation, primaryCta } from "@/config/navigation";
import { site } from "@/config/site";
import { useCurrentPath } from "@/lib/use-current-path";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { useLockScroll } from "@/lib/use-lock-scroll";
import { cn, isActivePath } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { MenuTrigger } from "@/components/layout/MenuTrigger";
import { headerRow } from "@/components/layout/header-row";

const ease = [0.22, 1, 0.36, 1] as const;

type FullscreenMenuProps = {
  open: boolean;
  onClose: () => void;
  restoreRef: RefObject<HTMLButtonElement | null>;
};

export function FullscreenMenu({ open, onClose, restoreRef }: FullscreenMenuProps) {
  const pathname = useCurrentPath();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useLockScroll(open);
  useFocusTrap(open, panelRef, restoreRef);

  useEffect(() => {
    if (!open) {
      return;
    }

    const main = document.getElementById("main-content");
    main?.setAttribute("inert", "");
    main?.setAttribute("aria-hidden", "true");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      main?.removeAttribute("inert");
      main?.removeAttribute("aria-hidden");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);


  const overlayTransition = reduceMotion
    ? { duration: 0.2 }
    : { duration: 0.72, ease };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-labelledby="site-menu-title"
          data-lenis-prevent
          className="fixed inset-0 z-[70] flex h-dvh min-h-svh w-full flex-col bg-surface"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 1, clipPath: "inset(6% 18% 86% 18% round 28px)" }
          }
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)" }
          }
          exit={
            reduceMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  clipPath: "inset(8% 38% 90% 38% round 24px)",
                }
          }
          transition={overlayTransition}
        >
          <p id="site-menu-title" className="sr-only">
            Site navigation
          </p>
          <div className={cn("mx-auto w-full max-w-[var(--container-max)] px-[var(--container-pad)] pt-6 pb-3", headerRow.row)}>
            <Logo onClick={onClose} className={headerRow.logo} />
            <MenuTrigger open onClick={onClose} controlsMenu={false} className={headerRow.trigger} />
            <span aria-hidden="true" />
          </div>

          <div className="mx-auto grid w-full max-w-[var(--container-max)] flex-1 grid-cols-1 items-center gap-12 overflow-y-auto px-[var(--container-pad)] py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:gap-16">
            <nav aria-label="Primary">
              <motion.ul
                className="group/nav"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: reduceMotion ? 0 : 0.075,
                      delayChildren: reduceMotion ? 0 : 0.22,
                    },
                  },
                }}
              >
                {navigation.map((item) => {
                  const active = pathname
                    ? isActivePath(pathname, item.href)
                    : false;

                  return (
                    <motion.li
                      key={item.href}
                      variants={{
                        hidden: reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: 36 },
                        visible: reduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: reduceMotion ? 0.2 : 0.62, ease }}
                      className="border-b border-border-subtle"
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group/item grid grid-cols-[3.5rem_minmax(0,1fr)_2.5rem] items-center py-3 outline-none transition-[opacity,color] duration-300 ease-[var(--ease-out)] sm:grid-cols-[4.5rem_minmax(0,1fr)_3rem] sm:py-4",
                          "focus-visible:text-foreground",
                          "group-hover/nav:opacity-35 hover:!opacity-100",
                          active ? "text-foreground" : "text-muted hover:text-foreground",
                        )}
                      >
                        <span className="font-display text-sm tracking-[0.12em] text-muted transition-colors duration-300 group-hover/item:text-accent">
                          {item.number}
                        </span>
                        <span className="overflow-hidden">
                          <span className="block font-display text-[clamp(2.25rem,7vw,5.25rem)] leading-[1.02] font-medium tracking-[-0.05em] transition-transform duration-300 ease-[var(--ease-out)] group-hover/item:translate-x-2 group-focus-visible/item:translate-x-2">
                            {item.label}
                          </span>
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="size-6 justify-self-end opacity-0 transition-[opacity,transform] duration-300 ease-[var(--ease-out)] group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 group-hover/item:opacity-100 group-focus-visible/item:opacity-100 sm:size-7"
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>

            <motion.aside
              className="flex max-w-sm flex-col justify-end gap-8 pb-4 lg:justify-center lg:pb-0"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{
                duration: reduceMotion ? 0.2 : 0.6,
                ease,
                delay: reduceMotion ? 0 : 0.48,
              }}
            >
              <p className="text-label font-medium uppercase tracking-[var(--tracking-label)] text-muted">
                Studio
              </p>
              <p className="font-display text-3xl leading-tight tracking-[-0.04em] text-foreground sm:text-4xl">
                {site.tagline}
              </p>
              <p className="text-[1.05rem] leading-relaxed text-muted">
                {site.description}
              </p>
              <Button href={primaryCta.href} showArrow onClick={onClose}>
                {primaryCta.label}
              </Button>
            </motion.aside>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
