import { serviceById } from "@/data/service-catalog";

/**
 * Homepage services showcase (ServicesShowcase). One entry per service, in
 * display and reading order.
 *
 * - `size` and `track` set the gallery rhythm: wide landscape panels and
 *   smaller ones, staggered across the upper and lower tracks. The last two
 *   sit on the upper track so the finished frame leaves the "Services"
 *   title (along the lower track's edge) clear.
 * - `href` is optional. Leave it out until a real destination exists; items
 *   without one render as plain, non-interactive content.
 * - `illustrative` marks concept mockups made for this page (no client work).
 */
export type ShowcaseService = {
  /** Service id in service-catalog.ts, which supplies number and title. */
  id: string;
  number: string;
  title: string;
  image: { src: string; alt: string; credit?: string };
  size: "wide" | "compact";
  track: "upper" | "lower";
  href?: string;
  illustrative: boolean;
};

const entries: Omit<ShowcaseService, "number" | "title">[] = [
  {
    id: "brand-identity-design",
    image: {
      src: "/images/services-showcase/brand-identity.jpg",
      alt: "Illustrative identity system for a fictional studio: letterhead, business cards and colour swatches",
    },
    size: "wide",
    track: "upper",
    illustrative: true,
  },
  {
    id: "social-media-design",
    image: {
      src: "/images/services-showcase/social-media.jpg",
      alt: "Illustrative social campaign: six matching posts in orange, black and cream",
    },
    size: "wide",
    track: "lower",
    illustrative: true,
  },
  {
    id: "product-design",
    image: {
      src: "/images/services-showcase/product-design.jpg",
      alt: "Illustrative dashboard prototype with order metrics and a weekly chart",
    },
    size: "compact",
    track: "upper",
    illustrative: true,
  },
  {
    id: "logo-design",
    image: {
      src: "/images/services-showcase/logo-design.jpg",
      alt: "Illustrative logo mark on a construction grid with light and dark variants",
    },
    size: "wide",
    track: "lower",
    illustrative: true,
  },
  {
    id: "flyer-poster-design",
    image: {
      src: "/images/services-showcase/flyer-poster.jpg",
      alt: "Two illustrative printed posters: a live music night and an exhibition",
    },
    size: "wide",
    track: "upper",
    illustrative: true,
  },
  {
    id: "website-design",
    image: {
      src: "/images/services-showcase/website-design.jpg",
      alt: "Illustrative website homepage for a homeware shop in a browser window",
    },
    size: "compact",
    track: "lower",
    illustrative: true,
  },
  {
    id: "mobile-app-design",
    image: {
      src: "/images/services-showcase/mobile-app.jpg",
      alt: "Three illustrative mobile app screens: onboarding, routines list and a focus timer",
    },
    size: "wide",
    track: "upper",
    illustrative: true,
  },
  {
    id: "motion-graphics",
    image: {
      src: "/images/services-showcase/motion-graphics.jpg",
      alt: "Illustrative motion-design frame: animated title with motion trails above an editing timeline",
    },
    size: "compact",
    track: "upper",
    illustrative: true,
  },
];

export const showcaseServices: ShowcaseService[] = entries.map((entry) => {
  const { number, title } = serviceById(entry.id);
  return { ...entry, number, title };
});
