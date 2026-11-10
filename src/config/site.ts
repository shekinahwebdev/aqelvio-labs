export const site = {
  name: "Aqelvio Labs",
  shortName: "Aqelvio",
  legalName: "Aqelvio Labs",
  tagline: "Engineering Ideas Into Reality.",
  eyebrow: "Independent Software Engineering Studio",
  description:
    "We design and build exceptional websites, custom software, and intelligent digital solutions that help ambitious businesses move forward.",
  longDescription:
    "Aqelvio Labs is an independent technology studio focused on creating useful, reliable, and thoughtfully designed digital products.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /**
   * Contact channels are pending configuration.
   * Do not invent addresses, phone numbers, or social accounts.
   */
  email: null as string | null,
  social: {} as Record<string, string>,
  seo: {
    defaultTitle: "Aqelvio Labs — Engineering Ideas Into Reality",
    titleTemplate: "%s — Aqelvio Labs",
  },
  collaborators: {
    achevaGraphix: {
      name: "Acheva Graphix",
      relationship:
        "An independently operated creative brand we may collaborate with on branding, graphic design and motion graphics.",
    },
  },
} as const;
