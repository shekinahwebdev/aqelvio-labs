/**
 * Content for the end of the homepage: FAQs, the image-wall call to
 * action and the footer statement. Answers describe how enquiries start;
 * they make no promises about prices, timelines, revisions or contracts.
 */

export type Faq = { question: string; answer: string };

export const faqIntro = {
  heading: "FAQs",
  body: "Answers to common questions about our services and how a project begins.",
} as const;

export const faqs: readonly Faq[] = [
  {
    question: "What services do you offer?",
    answer:
      "We build websites, custom software, mobile applications, AI and automation tools, and backend and cloud systems, with website, product and app design as part of that work. Branding, graphic design and motion graphics may be provided in collaboration with Acheva Graphix, an independently operated creative brand.",
  },
  {
    question: "How do I start a project?",
    answer:
      "Use Start a Project to share what you need, your goals, and any relevant references. We can then discuss the scope and next steps.",
  },
  {
    question: "How much will my project cost?",
    answer:
      "Pricing depends on the scope, deliverables, and complexity. Share your brief so we can prepare a tailored quote. Hosting, domains and maintenance are separate from the development fee.",
  },
  {
    question: "How long does a project take?",
    answer:
      "Timelines depend on the work involved and the feedback process. We agree on a schedule once the scope is clear.",
  },
  {
    question: "Can I request several services together?",
    answer: "Yes. Tell us which services you need so we can discuss a coordinated scope.",
  },
  {
    question: "Can you improve an existing brand or website?",
    answer:
      "Yes. Share what you already have and what you want to improve, and we can discuss a suitable approach.",
  },
];

/**
 * The image wall: real work only (see projects.ts for the sources).
 * Panels are decorative; `compact: false` panels are left out on small
 * screens, where the wall is three columns.
 */
export type WallImage = {
  src: string;
  /** object-position inside the portrait cell. */
  position: string;
  compact: boolean;
};

export const ctaWall = {
  headline: "Let’s Build Something Great.",
  images: [
    { src: "/images/projects/apiki-choco-crunch-poster-v2.jpg", position: "50% 30%", compact: true },
    { src: "/images/projects/pa-tech-desktop-v2.jpg", position: "8% 70%", compact: false },
    { src: "/images/projects/tgif-night-party-poster.jpg", position: "50% 25%", compact: true },
    { src: "/images/projects/alpha-academy-mobile-v2.jpg", position: "50% 0%", compact: true },
    { src: "/images/projects/choco-buddy-animation-poster.jpg", position: "42% 50%", compact: true },
    { src: "/images/projects/pa-tech-mobile-v2.jpg", position: "50% 30%", compact: true },
    { src: "/images/projects/apiki-choco-crunch-pack.jpg", position: "50% 50%", compact: true },
    { src: "/images/projects/alpha-academy-desktop-v2.jpg", position: "72% 40%", compact: false },
  ] satisfies WallImage[],
  /** Shown with the call to action: who made the imagery behind it. */
  credit: "Imagery: websites by Aqelvio Labs; artwork and animation by Acheva Graphix (collaborator).",
} as const;

export const footerStatement = "Thoughtful design. Purposeful software.";

/**
 * The reference's CTA timeline (Origin Studio, animateCTAGrid, read from
 * its live code): the stage is held for 250% of the viewport while panels
 * rise from one viewport below, tipped back 70° and 900px nearer (random
 * order, spread over 0.4), then the 0.8 overlay fades in as the headline's
 * letters rise (random, 0.04 apart), then the button. Scrub lag 0.3s, ease
 * "sine". `hold` adds a still, readable final state before release.
 */
export const ctaMotion = {
  desktop: { distance: 2.5, hold: 0.4, rise: 1, tilt: 70, depth: 900 },
  compact: { distance: 1.5, hold: 0.3, rise: 0.6, tilt: 55, depth: 500 },
  spread: 0.4,
  charStagger: 0.04,
  scrub: 0.3,
} as const;
