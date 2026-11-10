/**
 * "What We Do" section (WhatWeDo). Copy, sculpture panels and the
 * scroll-driven poses all live here.
 */
export const whatWeDo = {
  heading: { lead: "What", trail: "We Do" },
  items: [
    {
      title: "Brand & Visual Identity",
      body: "We create distinctive identities, logos, and campaign visuals that help brands communicate clearly.",
    },
    {
      title: "Digital Product Experiences",
      body: "We design websites, mobile apps, and digital products around the people who use them.",
    },
    {
      title: "Content & Motion",
      body: "We bring ideas to life through social media design, flyers and posters, and motion graphics.",
    },
  ],
} as const;

/**
 * The image cube, rebuilt from the motion reference (Origin Studio's
 * services cube, inspected live at 1440×900): six square faces around a
 * zero-size centre. Front and back sit ±½ edge from the centre; the four
 * sides start on the back face and are hinged on its edges (transform
 * origin on the shared edge), so the cube's own twist and skew act on each
 * face about a different axis — that is what spreads the faces apart.
 *
 * Each face is two-sided: `src` on its outer side and `backSrc` on its
 * inner side, both drawn upright (never a mirrored image, never a blank).
 * `position`/`backPosition` set each image's object-position.
 */
export type CubeFaceKey = "front" | "back" | "left" | "right" | "top" | "bottom";

export type CubeFace = {
  face: CubeFaceKey;
  /** Depth of the face plane from the centre, in cube edges. */
  z: number;
  /** Hinge rotation applied after the twist (sides only). */
  hinge: string;
  /** Transform origin: the hinge edge for sides, the centre otherwise. */
  origin: string;
  src: string;
  backSrc: string;
  position?: string;
  backPosition?: string;
};

const img = (name: string) => `/images/services-showcase/${name}.jpg`;

/*
 * The reference's six photos are bright and saturated, so the open cube
 * reads as lit planes. motion-graphics (mean luminance 21/255) and
 * social-media (76/255) are near-black and read as blank dark backs when
 * they fill a face (the open cube shows inner sides at full size), so the
 * sculpture uses only the six light images, some on two sides.
 */
export const cubeFaces: CubeFace[] = [
  { face: "front", z: 0.5, hinge: "rotate(0deg)", origin: "50% 50%", src: img("logo-design"), backSrc: img("product-design") },
  { face: "back", z: -0.5, hinge: "rotate(0deg)", origin: "50% 50%", src: img("product-design"), position: "30% 50%", backSrc: img("brand-identity"), backPosition: "25% 50%" },
  { face: "left", z: -0.5, hinge: "rotateY(-90deg)", origin: "0% 50%", src: img("flyer-poster"), position: "38% 50%", backSrc: img("website-design"), backPosition: "70% 50%" },
  { face: "right", z: -0.5, hinge: "rotateY(90deg)", origin: "100% 50%", src: img("mobile-app"), backSrc: img("brand-identity"), backPosition: "60% 50%" },
  { face: "top", z: -0.5, hinge: "rotateX(90deg)", origin: "50% 0%", src: img("website-design"), position: "45% 50%", backSrc: img("flyer-poster"), backPosition: "80% 50%" },
  { face: "bottom", z: -0.5, hinge: "rotateX(-90deg)", origin: "50% 100%", src: img("brand-identity"), position: "60% 50%", backSrc: img("mobile-app"), backPosition: "40% 50%" },
];

/**
 * The scroll timeline, as measured on the reference (sampled live at
 * 1440×900 and 390×844, forwards and backwards; identical at both).
 * Everything is linear (scrubbed) and expressed in timeline units: the
 * reference spends 44 units between its section top reaching 75% of the
 * viewport and its bottom leaving the top — 5.75 viewport heights, so
 * 1 unit = 117.6px at 900px tall — with the cube pinned for 4 of them.
 *
 *   0–12   entrance: the whole cube scales 0 → 1
 *   12–44  the cube turns about its vertical axis, 0 → −900° (2.5 turns)
 *   16–17  each face's images shrink to 0.7 — joined cube → separate planes
 *   24–25  every face twists 0 → 45° about its own hinge — the diamond
 *   32–33  the twist returns to 0 while every face shears to −12°
 *
 * The same timeline and pin run at every width, as in the reference.
 *
 * The reference's range ends with its section's bottom leaving the top of
 * the viewport, which needs a viewport of content after it. What We Do is
 * the last section, so the page would end at 1.9 turns. Instead the pin is
 * one viewport longer and the range ends at "bottom bottom": the same
 * 5.75 viewports (so the same rate), and the full 2.5 turns complete pinned.
 */
export const cubeMotion = {
  start: "top 75%",
  end: "bottom bottom",
  pinViewports: 4,
  entrance: { at: 0, duration: 12 },
  rotate: { at: 12, duration: 32, deg: -900 },
  separate: { at: 16, duration: 1, scale: 0.7 },
  twist: { at: 24, duration: 1, deg: 45 },
  shear: { at: 32, duration: 1, skewDeg: -12 },
} as const;

/** When each text block fades in, in timeline units. */
export const itemRevealAt = [12, 22, 30] as const;

/** Reduced motion / no JS: a still, opened arrangement. */
export const cubeRestPose = { rotateY: -38, separate: 0.7, twist: 0, shear: 0 } as const;
