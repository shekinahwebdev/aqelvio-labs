/**
 * Content for /about. Facts only: no years, counts, clients or awards.
 *
 * Founder details still needed (do not guess them here):
 *   - Patricia's brother's name. Until it is supplied his profile is
 *     headed by the studio he leads, Acheva Graphix (`name: null`).
 *   - Portraits of both founders. Until they are supplied the hero and
 *     profiles use real project work, captioned as such (`portrait: null`).
 */

export type AboutImage = { src: string; alt: string; position?: string };

export type Founder = {
  id: string;
  /** Real name; null until verified. */
  name: string | null;
  /** Shown as the heading while `name` is null. */
  fallbackHeading: string;
  role: string;
  bio: string;
  portrait: AboutImage | null;
  /** Work image shown until a portrait exists, with its credit. */
  work: AboutImage & { caption: string };
};

export const aboutHero = {
  wordmark: "Aqelvio Labs",
  statements: ["Two minds.", "Different strengths.", "One shared vision."],
  labels: { left: "/Software & Digital", right: "/Brand & Visual Design" },
  /* Real work, one image per discipline (no founder photographs yet). */
  images: {
    /* Shown whole in a browser frame over its own blurred colours. */
    left: {
      src: "/images/projects/pa-tech-desktop-v2.jpg",
      alt: "",
      position: "50% 0%",
      backdrop: "/images/projects/pa-tech-frame-backdrop.jpg",
    },
    right: {
      src: "/images/projects/tgif-night-party-poster.jpg",
      alt: "",
      position: "50% 0%",
      backdrop: null,
    },
  },
  credit: "Imagery: PA Tech Services website by Aqelvio Labs · TGIF Night Party poster by Acheva Graphix (collaborator)",
} as const;

export const aboutStory = {
  heading: ["Different strengths.", "Shared ambition."],
  copy: [
    "Aqelvio Labs began with two siblings and a shared ambition: to bring thoughtful design and practical technology together.",
    "One of us builds the digital experience. The other shapes its visual identity. Together, we help turn ideas into brands, websites and digital experiences that feel connected from the first impression to the final interaction.",
  ],
  statements: ["Built with purpose.", "Designed with intention.", "Created together."],
} as const;

export const aboutProcess = [
  { number: "01", title: "Understand", text: "We start with your idea, your audience and what the project needs to achieve." },
  {
    number: "02",
    title: "Shape",
    text: "We define the direction, bringing visual identity and digital experience into the same conversation.",
  },
  { number: "03", title: "Create", text: "We design and build, sharing progress and refining the details through feedback." },
  {
    number: "04",
    title: "Deliver",
    text: "We prepare the agreed work for launch or handover, with clarity on what comes next.",
  },
] as const;

export const founders: readonly Founder[] = [
  {
    id: "patricia-kanneh",
    name: "Patricia Kanneh",
    fallbackHeading: "Patricia Kanneh",
    role: "Co-founder · Software & Digital Experiences",
    bio: "Patricia focuses on building websites, applications and digital tools that turn ideas into useful experiences.",
    portrait: null,
    work: {
      src: "/images/projects/alpha-academy-desktop-v2.jpg",
      alt: "Alpha Academy website homepage, developed by Aqelvio Labs.",
      position: "50% 0%",
      caption: "Work: Alpha Academy website",
    },
  },
  {
    id: "acheva-graphix-founder",
    name: null,
    fallbackHeading: "Acheva Graphix",
    role: "Co-founder · Brand & Visual Design",
    bio: "The creative behind Acheva Graphix, he shapes visual identities, campaign artwork and motion that help brands communicate.",
    portrait: null,
    work: {
      src: "/images/projects/apiki-choco-crunch-poster-v2.jpg",
      alt: "Apiki Choco Crunch poster by Acheva Graphix.",
      position: "50% 30%",
      caption: "Work: Apiki Choco Crunch poster",
    },
  },
];

export const aboutApproach = {
  heading: "From how it looks to how it works.",
  copy: "A strong identity should carry through to the website. A well-built product should feel as considered as the brand behind it. We bring those decisions together throughout the project.",
  relationship: "Aqelvio Labs brings software and digital experiences together with creative work from Acheva Graphix.",
  /* Grouped from the service catalog; titles and links come from there. */
  areas: [
    { title: "Brand & Visual Identity", serviceIds: ["brand-identity-design", "logo-design"] },
    { title: "Websites & Digital Products", serviceIds: ["website-design", "product-design", "mobile-app-design"] },
    {
      title: "Content & Motion",
      serviceIds: ["social-media-design", "flyer-poster-design", "motion-graphics"],
    },
  ],
} as const;

export const aboutWork = {
  heading: "Work where software and visual design meet.",
  /* Slugs in projects.ts. */
  slugs: ["pa-tech-services", "alpha-academy", "apiki-choco-crunch"],
} as const;

export const aboutValues = [
  { title: "Clarity", text: "Make the message clear and the experience understandable." },
  { title: "Purpose", text: "Give every visual and technical decision a reason." },
  { title: "Collaboration", text: "Keep communication direct and feedback part of the process." },
  { title: "Care", text: "Pay attention to the details people see and the ones they depend on." },
] as const;
