"use client";

import { useReducedMotion } from "motion/react";
import { site } from "@/config/site";
import { HeroOrbit } from "@/components/home/HeroOrbit";
import { HeroTickRing } from "@/components/home/HeroTickRing";
import { HeroSocialRail } from "@/components/home/HeroSocialRail";
import { HeroServiceLabels } from "@/components/home/HeroServiceLabels";
import { HeroScrollIndicator } from "@/components/home/HeroScrollIndicator";
import { useMounted } from "@/lib/use-mounted";

/*
 * ≥1312px (`hero:` breakpoint, 82rem): three columns in one viewport-
 * fitting stage — the approved desktop composition.
 *
 * Under 1312px the hero follows the reference's reflow and grows past the
 * first screen: the orbit stage on top, then
 *   <480px    socials (row, left) beside the label marquee + scroll cue (right)
 *   480–1311  socials (column), then the scroll cue (left) and marquee (right)
 * The stage is a square whose width sets every orbit measurement (see
 * `.hero-card-size`): nearly the full hero width on phones (8px gutters),
 * 440px from 480px, 600px from 768px.
 *
 * Card size lives in `.hero-card-size` (globals.css), independent of the type.
 */

export function HeroExperience() {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion() === true;
  const play = mounted && !reduceMotion;

  return (
    <div
      data-hero-play={play ? "true" : "false"}
      data-hero-reduce={mounted && reduceMotion ? "true" : "false"}
      className="hero-card-size relative overflow-x-clip bg-black px-4 pt-14 pb-[3.75rem] min-[480px]:px-6 min-[480px]:pt-[3.75rem] min-[480px]:pb-[4.375rem] md:px-8 md:pt-[4.5rem] md:pb-20 hero:h-[calc(var(--hero-center-y)*2)] hero:px-[max(1.25rem,calc((100vw-1360px)/2))] hero:py-3"
    >
      <div className="mx-auto flex w-full max-w-[492px] flex-col items-center md:max-w-[704px] hero:grid hero:h-full hero:max-w-[1360px] hero:grid-cols-[1fr_5fr_1fr] hero:items-center hero:gap-10">
        <div className="hidden hero:flex hero:justify-center">
          <HeroSocialRail />
        </div>

        <div
          data-hero-stage
          className="@container relative mx-auto flex aspect-square w-[calc(100%+1rem)] shrink-0 items-center justify-center min-[480px]:my-2 min-[480px]:w-[min(440px,calc(100%+2rem))] md:my-3 md:w-[600px] hero:my-0 hero:w-[min(755px,100%,calc((100svh-var(--header-height)-1.5rem)/1.25))]"
        >
          <div className="hero-orbit-fade pointer-events-none absolute inset-0">
            <HeroOrbit animate={play} />
          </div>

          <div className="relative z-10 flex size-[var(--hero-ring-d)] flex-col items-center justify-center overflow-hidden rounded-full">
            <div className="hero-ring absolute inset-0" aria-hidden="true">
              <HeroTickRing className="size-full text-white/60" />
            </div>

            <h1
              id="home-hero-heading"
              className="relative z-[1] flex flex-col items-center overflow-hidden text-center"
            >
              <span className="hero-name font-display text-[length:var(--hero-name-size)] font-semibold leading-none tracking-[-0.02em] text-[#fdfcfc] hero:leading-[1.24]">
                {site.shortName}
              </span>
              <span className="hero-labs mt-1 font-display text-[length:var(--hero-labs-size)] font-normal leading-none tracking-[-0.02em] text-[#ffffff8c] hero:mt-0 hero:leading-[1.24]">
                Labs
              </span>
            </h1>
          </div>
        </div>

        <div className="relative hidden h-full hero:flex hero:items-center hero:justify-end">
          <HeroServiceLabels />
          {/* Pinned to the first fold's bottom, not the (taller) hero's. */}
          <div className="absolute right-0 top-[calc(100svh-var(--header-height)-6.5rem)]">
            <HeroScrollIndicator targetId="home-continue" />
          </div>
        </div>

        <div className="mt-12 grid w-full grid-cols-2 items-center gap-x-6 min-[480px]:mt-14 min-[480px]:flex min-[480px]:flex-col min-[480px]:items-stretch min-[480px]:gap-20 md:mt-9 md:gap-8 hero:hidden">
          <HeroSocialRail layout="compact" />
          <div className="flex flex-col items-end gap-[3.75rem] min-[480px]:flex-row-reverse min-[480px]:justify-between md:ml-auto md:w-[385px]">
            <HeroServiceLabels compact />
            <HeroScrollIndicator targetId="home-continue" className="max-hero:ml-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
