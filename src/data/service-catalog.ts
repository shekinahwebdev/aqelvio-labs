import { primaryCta } from "@/config/navigation";

/**
 * The eight design services we currently offer: the single source for their ids, numbers,
 * titles, descriptions, deliverables, media and destinations. The /services
 * page renders all of it; the homepage showcase takes its titles and
 * numbers from here (it keeps its own illustrative images).
 *
 * Only what is true belongs here:
 *   - Descriptions say what each service is; no prices, timelines,
 *     revision terms or results.
 *   - Media is real work where we have it. Acheva Graphix work is credited
 *     to them as a collaborator; the two websites were developed by
 *     Aqelvio Labs. Where no real work has been supplied (product design,
 *     mobile app design) the image is an illustrative concept, labelled as
 *     such on the page.
 *   - Only services offered now. UI/UX design and photography are not
 *     offered, so they are not listed or described (completed portfolio
 *     work keeps its own history in projects.ts).
 *   - The contact page does not take a service selection yet, so every
 *     action goes to it plainly. Add `?service=` only once it reads it.
 */

export type ServiceMedia =
  | {
      type: "image";
      src: string;
      width: number;
      height: number;
      alt: string;
      /** "cover" fills the frame; "contain" keeps finished artwork whole. */
      fit: "cover" | "contain";
      position?: string;
      /** Shown around contained artwork. */
      backdrop?: { image?: string; color: string };
    }
  | {
      type: "video";
      src: string;
      poster: string;
      width: number;
      height: number;
      /** Accessible name for the video. */
      label: string;
    };

export type ServiceMediaSource =
  | { kind: "collaborator"; text: string }
  | { kind: "studio"; text: string }
  | { kind: "illustrative"; text: string }
  | { kind: "stock"; text: string };

export type Service = {
  /** Stable id: the panel's anchor (/services#id). */
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: readonly string[];
  media: ServiceMedia;
  /** Who made the media, or what it is. Always shown. */
  source: ServiceMediaSource;
  /** Where "Discuss this service" goes. */
  contactHref: string;
};

const acheva = (role: string): ServiceMediaSource => ({
  kind: "collaborator",
  text: `${role} by Acheva Graphix (collaborator)`,
});

export const serviceCatalog: readonly Service[] = [
  {
    id: "brand-identity-design",
    number: "01",
    title: "Brand Identity Design",
    description:
      "A visual identity that makes your business recognisable wherever it appears, with colour, type and imagery working as one system across packaging, print and screens.",
    deliverables: ["Visual direction", "Colour and typography", "Brand guidelines"],
    media: {
      type: "image",
      src: "/images/projects/apiki-choco-crunch-poster-v2.jpg",
      width: 1272,
      height: 2000,
      alt: "Apiki Choco Crunch poster: chocolate cereal rings and cocoa beans splashing from a bowl of milk, with a smiling cocoa-pod mascot.",
      fit: "contain",
      backdrop: { image: "/images/projects/apiki-choco-crunch-backdrop.jpg", color: "#7a4214" },
    },
    source: acheva("Apiki Choco Crunch packaging artwork"),
    contactHref: primaryCta.href,
  },
  {
    id: "social-media-design",
    number: "02",
    title: "Social Media Design",
    description:
      "Posts and carousels made for the feed: quick to read, consistent with your brand, and ready for the formats your audience scrolls past every day.",
    deliverables: ["Post designs", "Carousel designs", "Campaign templates"],
    media: {
      type: "image",
      src: "/images/projects/gid-nkate-cake-post.jpg",
      width: 1600,
      height: 1606,
      alt: "Social post for GID Nkate Cake: peanut brittle bars on a white plate, “Feel the crunch”, a 30% off badge and delivery details on yellow.",
      fit: "contain",
      backdrop: { color: "#f6c500" },
    },
    source: acheva("GID Nkate Cake social post"),
    contactHref: primaryCta.href,
  },
  {
    id: "product-design",
    number: "03",
    title: "Product Design",
    description:
      "Digital products shaped around the people who use them, planned from the first idea to designs and prototypes you can click through before anything is built.",
    deliverables: ["Product planning", "Product screens", "Interactive prototypes"],
    media: {
      type: "image",
      src: "/images/services-showcase/product-design.jpg",
      width: 1400,
      height: 860,
      alt: "Illustrative dashboard prototype with order metrics and a weekly chart.",
      fit: "cover",
      position: "30% 50%",
    },
    source: { kind: "illustrative", text: "Illustrative concept, not client work" },
    contactHref: primaryCta.href,
  },
  {
    id: "logo-design",
    number: "04",
    title: "Logo Design",
    description:
      "A distinctive mark that stays legible from a social avatar to a shop sign, with versions for light and dark backgrounds and clear rules for using it.",
    deliverables: ["Logo concepts", "Variations", "Usage guidance"],
    media: {
      type: "image",
      src: "/images/projects/apiki-cereal-logo.jpg",
      width: 900,
      height: 860,
      alt: "Apiki Cereal logo: two orange wheat ears curving around the wordmark inside white rings, on blue.",
      fit: "contain",
      backdrop: { color: "#365fe2" },
    },
    source: acheva("Apiki Cereal logo"),
    contactHref: primaryCta.href,
  },
  {
    id: "flyer-poster-design",
    number: "05",
    title: "Flyer & Poster Design",
    description:
      "Event and promotional layouts with a clear order of information, so what, where and when read at a glance, on screen or in print.",
    deliverables: ["Digital flyers", "Posters", "Print-ready layouts"],
    media: {
      type: "image",
      src: "/images/projects/tgif-night-party-poster.jpg",
      width: 1297,
      height: 1728,
      alt: "TGIF Night Party poster: a stylised portrait in orange sunglasses, “Rate: Free!!”, location Kingsby Hotel, 6th April, 8:30pm.",
      fit: "contain",
      backdrop: { image: "/images/projects/tgif-night-party-backdrop.jpg", color: "#8a2a0a" },
    },
    source: acheva("TGIF Night Party poster"),
    contactHref: primaryCta.href,
  },
  {
    id: "website-design",
    number: "06",
    title: "Website Design",
    description:
      "Responsive websites that present what you do clearly and lead visitors to the next step, designed for phones as carefully as for large screens.",
    deliverables: ["Responsive layouts", "Page design", "Interaction design"],
    media: {
      type: "image",
      src: "/images/projects/pa-tech-desktop-v2.jpg",
      width: 2400,
      height: 1500,
      alt: "PA Tech Services website homepage: “Reliable technology built for everyday life.” over a dark server-rack photograph.",
      fit: "cover",
      position: "18% 50%",
    },
    source: { kind: "studio", text: "PA Tech Services website, developed by Aqelvio Labs" },
    contactHref: primaryCta.href,
  },
  {
    id: "mobile-app-design",
    number: "07",
    title: "Mobile App Design",
    description:
      "App screens and navigation planned for small screens and quick, one-handed use, from the first launch to everyday tasks, and prototyped so they can be tried early.",
    deliverables: ["Screen layouts", "App navigation", "Prototypes"],
    media: {
      type: "image",
      src: "/images/services-showcase/mobile-app.jpg",
      width: 1400,
      height: 860,
      alt: "Three illustrative mobile app screens: onboarding, a routines list and a focus timer.",
      fit: "cover",
      position: "50% 50%",
    },
    source: { kind: "illustrative", text: "Illustrative interface preview, not client work" },
    contactHref: primaryCta.href,
  },
  {
    id: "motion-graphics",
    number: "08",
    title: "Motion Graphics",
    description:
      "Animation that gives products and messages movement, for social media, screens and promotions, from short product reveals to animated logos.",
    deliverables: ["Animated graphics", "Promotional visuals", "Logo animation"],
    media: {
      type: "video",
      src: "/media/projects/choco-buddy-animation.mp4",
      poster: "/images/projects/choco-buddy-animation-poster.jpg",
      width: 1920,
      height: 1080,
      label: "Choco Buddy product animation: cocoa beans fly past, then the milk chocolate and strawberries & cream packs appear.",
    },
    source: acheva("Choco Buddy product animation"),
    contactHref: primaryCta.href,
  },
];

export function serviceById(id: string): Service {
  const service = serviceCatalog.find((item) => item.id === id);
  if (!service) throw new Error(`Unknown service id: ${id}`);
  return service;
}

/** Introduction of the /services page. */
export const servicesIntro = {
  heading: ["Distinctive brands.", "Thoughtful digital experiences."],
  body: "From websites and custom software to mobile apps, AI and automation, with the design that brings them together.",
  /** Id of the panels section (an in-page target: /services#services). */
  anchorId: "services",
} as const;
