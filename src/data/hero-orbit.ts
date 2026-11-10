export type HeroOrbitSlot =
  | "top"
  | "bottom"
  | "right"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type HeroOrbitCard = {
  id: string;
  src: string;
  /** Starting position on the orbit (rest layout below the hero breakpoint). */
  slot: HeroOrbitSlot;
  /** Provenance — every asset is original or Unsplash-licensed. */
  credit: string;
};

export const heroOrbitCards: HeroOrbitCard[] = [
  {
    id: "facade",
    src: "/images/hero/facade-mono.jpg",
    slot: "top",
    credit: "Samuel Zeller — unsplash.com/photos/j0g8taxHZa0 (Unsplash License)",
  },
  {
    id: "still-life",
    src: "/images/hero/still-life-blue.jpg",
    slot: "bottom",
    credit: "Padurariu Alexandru — unsplash.com/photos/iNmouRApXYM (Unsplash License)",
  },
  {
    id: "atrium",
    src: "/images/hero/spiral-atrium.jpg",
    slot: "right",
    credit: "Drew Patrick Miller — unsplash.com/photos/VLT62-JzddA (Unsplash License)",
  },
  {
    id: "interface",
    src: "/images/hero/studio-interface.jpg",
    slot: "left",
    credit: "Original Aqelvio artwork",
  },
  {
    id: "product",
    src: "/images/hero/studio-product-ui.jpg",
    slot: "top-left",
    credit: "Original Aqelvio artwork",
  },
  {
    id: "figure",
    src: "/images/hero/figure-amber.jpg",
    slot: "top-right",
    credit: "Luke Pamer — unsplash.com/photos/oUhr-qMTJoc (Unsplash License)",
  },
  {
    id: "commuter",
    src: "/images/hero/commuter-mono.jpg",
    slot: "bottom-left",
    credit: "Eutah Mizushima — unsplash.com/photos/2TlAsvhqiL0 (Unsplash License)",
  },
  {
    id: "light-ring",
    src: "/images/hero/light-ring.jpg",
    slot: "bottom-right",
    credit: "Kamesh Vedula — unsplash.com/photos/ISL7czxIP-k (Unsplash License)",
  },
];

/** Screen angle (deg, clockwise from 3 o'clock) each slot starts at. */
export const HERO_ORBIT_SLOT_ANGLE: Record<HeroOrbitSlot, number> = {
  right: 0,
  "bottom-right": 45,
  bottom: 90,
  "bottom-left": 135,
  left: 180,
  "top-left": 225,
  top: 270,
  "top-right": 315,
};

/** Measured on the reference: parent rotateZ increases 12deg/s. */
export const HERO_ORBIT_DURATION = 30;

/**
 * Desktop orbit geometry (≥1312px), measured on the reference: with a 148px
 * card, axis cards ride at ~336px from the ring centre and diagonal cards at
 * 358px. Radii are scaled by the rendered card width (÷ `referenceCardWidth`)
 * and by the `--hero-orbit-scale` CSS control.
 */
export const HERO_ORBIT_DESKTOP = {
  /**
   * Must match `--breakpoint-hero` (globals.css). 82rem is the narrowest
   * width where the full-size orbit (163px cards) clears the socials and
   * label columns with a ~16px margin, measured with the 6px page scrollbar.
   */
  query: "(min-width: 82rem)",
  referenceCardWidth: 148,
  radius: { axis: 336, diagonal: 358 },
} as const;

/* Services we offer now (see service-catalog.ts); no UI/UX design. */
export const heroServiceLabels = [
  "Brand Identity",
  "Development",
  "Web Design",
  "App Design",
  "Graphic Design",
] as const;

/** Webflow “Hero Load Anim” (a-54), times in seconds. Empty easing = ease. */
export const HERO_ENTRANCE = {
  title: { delay: 0.4, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  ringRotate: { delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
  ringFade: { delay: 0.4, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  labsMove: { delay: 0.5, duration: 0.6, ease: "easeOut" as const },
  labsFade: { delay: 0.5, duration: 0.5, ease: "easeIn" as const },
  rest: { delay: 1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
} as const;
