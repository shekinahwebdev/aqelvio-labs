"use client";

import { ArrowDown } from "lucide-react";
import { scrollToElement } from "@/lib/smooth-scroll";
import { cn } from "@/lib/utils";

type HeroScrollIndicatorProps = {
  targetId: string;
  className?: string;
};

export function HeroScrollIndicator({
  targetId,
  className,
}: HeroScrollIndicatorProps) {
  const scrollToNext = () => {
    const target = document.getElementById(targetId);
    if (target) {
      scrollToElement(target);
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToNext}
      className={cn(
        "hero-rail pointer-events-auto ml-auto flex h-20 w-[52px] items-center justify-center rounded-[40px] bg-[linear-gradient(#666,#020108_80%)] p-px outline-none focus-visible:ring-2 focus-visible:ring-focus max-hero:h-[60px] max-hero:w-[42px]",
        className,
      )}
      aria-label="Scroll to next section"
    >
      <span className="flex h-full w-full items-center justify-center rounded-[40px] bg-[#0f0f0f]">
        <span className="hero-mouse-bob" aria-hidden>
          <ArrowDown className="size-[18px] text-foreground" strokeWidth={1.75} />
        </span>
      </span>
    </button>
  );
}
