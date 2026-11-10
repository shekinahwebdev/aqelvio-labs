"use client";

import { useEffect, useRef, useState } from "react";
import { primaryCta } from "@/config/navigation";
import { useStartProjectLink } from "@/lib/use-start-project-link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { FullscreenMenu } from "@/components/layout/FullscreenMenu";
import { MenuTrigger } from "@/components/layout/MenuTrigger";
import { headerRow } from "@/components/layout/header-row";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const startProject = useStartProjectLink();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "hero-nav sticky top-0 z-50 border-b border-transparent pt-6 pb-3 transition-[background-color,border-color,backdrop-filter] duration-[var(--duration-mid)] ease-[var(--ease-out)]",
        scrolled &&
          !menuOpen &&
          "border-border-subtle bg-background/80 shadow-[var(--shadow-header)] backdrop-blur-[50px]",
      )}
    >
      <Container className={headerRow.row}>
        <Logo className={cn("justify-self-start", headerRow.logo)} />

        <MenuTrigger
          ref={triggerRef}
          open={menuOpen}
          tabIndex={menuOpen ? -1 : undefined}
          aria-hidden={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
          className={headerRow.trigger}
        />

        <div
          className={cn(
            "hidden justify-self-end sm:block",
            menuOpen && "pointer-events-none invisible",
          )}
          aria-hidden={menuOpen}
        >
          <Button href={startProject.href} onClick={startProject.onClick} showArrow>
            {primaryCta.label}
          </Button>
        </div>
      </Container>

      <FullscreenMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        restoreRef={triggerRef}
      />
    </header>
  );
}
