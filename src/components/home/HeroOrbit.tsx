"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import {
  heroOrbitCards,
  HERO_ORBIT_DESKTOP,
  HERO_ORBIT_DURATION,
  HERO_ORBIT_SLOT_ANGLE,
  type HeroOrbitSlot,
} from "@/data/hero-orbit";
import { cn } from "@/lib/utils";

/**
 * Rest positions before GSAP takes over (first paint, no JS). Desktop uses
 * the classes below; under the hero breakpoint each card sits on the measured orbit —
 * `--orbit-cos/sin` × the slot's radius fraction × the stage width — which is
 * exactly where HeroOrbit's angle-0 frame puts it, so nothing jumps.
 */
const compactSlot =
  "max-hero:right-auto max-hero:bottom-auto max-hero:m-0 max-hero:left-[calc(50%+var(--orbit-cos)*var(--orbit-r)*100%-var(--hero-card-w)/2)] max-hero:top-[calc(50%+var(--orbit-sin)*var(--orbit-r)*100%-var(--hero-card-h)/2)]";

const slotClass: Record<HeroOrbitSlot, string> = {
  top: "top-0 left-1/2 -ml-[calc(var(--hero-card-w)*0.5)]",
  bottom: "bottom-0 left-1/2 -ml-[calc(var(--hero-card-w)*0.5)]",
  right:
    "right-[2%] top-1/2 -mt-[calc(var(--hero-card-h)*0.5)] min-[1280px]:right-0",
  left: "left-[2%] top-1/2 -mt-[calc(var(--hero-card-h)*0.5)] min-[1280px]:left-0",
  "top-left": "top-[10%] left-[10%]",
  "top-right": "top-[10%] right-[10%]",
  "bottom-left": "bottom-[10%] left-[10%]",
  "bottom-right": "bottom-[10%] right-[10%]",
};

type HeroOrbitProps = {
  animate: boolean;
};

export function HeroOrbit({ animate }: HeroOrbitProps) {
  const ringRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ringRef.current;
    if (!root) {
      return;
    }

    const spins = gsap.utils.toArray<HTMLElement>("[data-orbit-spin]", root);
    const mm = gsap.matchMedia();
    const state = { angle: 0 };
    const centre = {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      margin: 0,
      xPercent: -50,
      yPercent: -50,
    };
    /*
     * One orbit tween for the whole hero, created outside matchMedia so a
     * layout switch never reverts it (a revert would snap the angle back to
     * the tween's start) and can never leave two running. Each layout only
     * registers how to draw the current angle.
     */
    let draw: (() => void) | null = null;
    const show = (render: () => void) => {
      draw = render;
      render();
      return () => {
        if (draw === render) draw = null;
      };
    };
    const orbit = animate
      ? gsap.to(state, {
          angle: 360,
          duration: HERO_ORBIT_DURATION,
          ease: "none",
          repeat: -1,
          onUpdate: () => draw?.(),
        })
      : null;

    /*
     * Desktop: one shared angle drives every card around the ring centre, so
     * the cards stay upright and in lockstep without a counter-rotation.
     * Radii follow the reference proportions, scaled from the rendered card.
     */
    mm.add(HERO_ORBIT_DESKTOP.query, () => {
      const hero = root.closest<HTMLElement>("[data-hero-play]");
      if (!hero) {
        return;
      }

      gsap.set(spins, centre);

      const cards = spins.map((el) => {
        const angle =
          HERO_ORBIT_SLOT_ANGLE[el.dataset.orbitSlot as HeroOrbitSlot];
        return {
          angle,
          radius:
            angle % 90 === 0
              ? HERO_ORBIT_DESKTOP.radius.axis
              : HERO_ORBIT_DESKTOP.radius.diagonal,
          setX: gsap.quickSetter(el, "x", "px"),
          setY: gsap.quickSetter(el, "y", "px"),
        };
      });

      let unit = 1;
      const measure = () => {
        const scale =
          Number.parseFloat(
            getComputedStyle(hero).getPropertyValue("--hero-orbit-scale"),
          ) || 1;
        unit =
          (spins[0].offsetWidth / HERO_ORBIT_DESKTOP.referenceCardWidth) *
          scale;
      };

      const render = () => {
        cards.forEach((card) => {
          const t = ((card.angle + state.angle) * Math.PI) / 180;
          card.setX(Math.cos(t) * card.radius * unit);
          card.setY(Math.sin(t) * card.radius * unit);
        });
      };

      measure();
      const hide = show(render);

      const onResize = () => {
        measure();
        render();
      };
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        hide();
      };
    });

    /*
     * Under the hero breakpoint: the same upright orbit, sized from the stage itself. The
     * ring box is the stage (a square), so its measured width is the unit for
     * the radii, matching the cqw-based card and ring sizes in CSS. Measured
     * with a ResizeObserver, so container resizes (embedded previews,
     * rotation) re-lay the orbit mid-animation.
     */
    mm.add(`not all and ${HERO_ORBIT_DESKTOP.query}`, () => {
      const hero = root.closest<HTMLElement>("[data-hero-play]");
      if (!hero) {
        return;
      }

      gsap.set(spins, centre);

      const styles = getComputedStyle(hero);
      const fraction = (name: string) =>
        Number.parseFloat(styles.getPropertyValue(name)) || 0;
      const axis = fraction("--hero-orbit-axis");
      const diagonal = fraction("--hero-orbit-diagonal");

      const cards = spins.map((el) => {
        const angle =
          HERO_ORBIT_SLOT_ANGLE[el.dataset.orbitSlot as HeroOrbitSlot];
        return {
          angle,
          radius: angle % 90 === 0 ? axis : diagonal,
          setX: gsap.quickSetter(el, "x", "px"),
          setY: gsap.quickSetter(el, "y", "px"),
        };
      });

      let size = root.clientWidth;
      const render = () => {
        cards.forEach((card) => {
          const t = ((card.angle + state.angle) * Math.PI) / 180;
          card.setX(Math.cos(t) * card.radius * size);
          card.setY(Math.sin(t) * card.radius * size);
        });
      };

      const hide = show(render);

      const observer = new ResizeObserver(() => {
        size = root.clientWidth;
        render();
      });
      observer.observe(root);
      return () => {
        observer.disconnect();
        hide();
      };
    });

    return () => {
      orbit?.kill();
      mm.revert();
    };
  }, [animate]);

  return (
    <div
      className="pointer-events-none absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 hero:h-[114%] hero:w-[114%]"
      aria-hidden="true"
    >
      <div ref={ringRef} data-orbit-ring className="relative h-full w-full">
        {heroOrbitCards.map((card) => {
          const angle = (HERO_ORBIT_SLOT_ANGLE[card.slot] * Math.PI) / 180;
          const rest = {
            "--orbit-cos": Math.cos(angle).toFixed(4),
            "--orbit-sin": Math.sin(angle).toFixed(4),
            "--orbit-r":
              HERO_ORBIT_SLOT_ANGLE[card.slot] % 90 === 0
                ? "var(--hero-orbit-axis)"
                : "var(--hero-orbit-diagonal)",
          } as CSSProperties;
          return (
            <div
              key={card.id}
              data-orbit-spin
              data-orbit-slot={card.slot}
              style={rest}
              className={cn(
                "absolute h-[var(--hero-card-h)] w-[var(--hero-card-w)] overflow-hidden rounded-[var(--hero-card-r)] bg-[#141414]",
                slotClass[card.slot],
                compactSlot,
              )}
            >
              <Image
                src={card.src}
                alt=""
                fill
                sizes="(min-width: 82rem) 164px, (min-width: 768px) 110px, 80px"
                loading="eager"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
