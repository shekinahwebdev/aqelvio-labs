/**
 * The single source for project content: the homepage reads
 * `featuredProjects`, /work reads `workProjects`, and /work/[slug] reads a
 * project with its `projectDetail`.
 *
 * Only verified facts belong here:
 *   - Website names, categories and URLs were checked on the live sites.
 *   - Creative work supplied by Acheva Graphix is credited to them as a
 *     collaborator. Titles come from the visible artwork and filenames;
 *     no client is named that the artwork does not show.
 *   - Every project has a detail page at /work/[slug] (`projectHref`),
 *     built from its entry in `details` below. Write only what is verified
 *     or visible; leave optional fields out rather than filling them.
 *
 * Original files stay where they were supplied; `public/` only holds
 * web-sized derivatives (see `source` on each media item).
 */

export type ProjectTitleTreatment = {
  /** Fill of the curved repeated title. */
  color: string;
  /**
   * How the title meets the image. "exclusion" (the motion reference's
   * treatment) inverts against whatever is underneath, so it stays legible
   * over mixed light and dark areas; "normal" is a plain fill.
   */
  blend: "normal" | "exclusion";
};

export type ProjectImage = {
  src: string;
  width: number;
  height: number;
  /** Empty only for purely decorative images. */
  alt: string;
  /** object-position: the focal point kept in frame at every crop. */
  position?: string;
};

export type ProjectCover = ProjectImage & {
  /**
   * "cover" fills the frame (screenshots, video). "contain" keeps finished
   * artwork whole — posters keep their type and logos — over `backdrop`.
   */
  fit: "cover" | "contain";
  /** Fit in portrait viewports, when it differs (e.g. a 16:9 video). */
  portraitFit?: "cover" | "contain";
  /** Art-directed image for portrait viewports (e.g. a mobile screenshot). */
  portrait?: ProjectImage;
  /** Shown around contained artwork: a small pre-blurred image and/or a colour. */
  backdrop?: { image?: string; color: string };
  /** True when the image illustrates the idea, not the product itself. */
  concept?: boolean;
  /** Work page: show a website screenshot in a browser (phone) frame. */
  frame?: "browser";
};

export type ProjectMedia =
  | ({ type: "image"; source?: string } & ProjectImage)
  | {
      type: "video";
      src: string;
      width: number;
      height: number;
      /** Accessible name for the video. */
      label: string;
      poster: string;
      /** Plays muted in the panel while it is on screen (motion allowed). */
      preview?: boolean;
      source?: string;
    };

export type ProjectCredit = {
  name: string;
  /** What they did, e.g. "Design". */
  role: string;
  /**
   * "studio": Aqelvio Labs' own work. "collaborator": a partner's work,
   * never presented as solely Aqelvio Labs'. "credited": a third party
   * credited on the artwork itself (e.g. a photographer's watermark).
   */
  relation: "studio" | "collaborator" | "credited";
};

/**
 * Portfolio filter on the Work page. Only categories that contain a
 * project are offered there.
 */
export type ProjectFilter =
  | "websites"
  | "brand-identity"
  | "logo-design"
  | "social-media"
  | "flyers-posters"
  | "motion-graphics";

export const projectFilters: readonly { id: ProjectFilter; label: string }[] = [
  { id: "websites", label: "Websites" },
  { id: "brand-identity", label: "Brand Identity" },
  { id: "logo-design", label: "Logo Design" },
  { id: "social-media", label: "Social Media" },
  { id: "flyers-posters", label: "Flyers & Posters" },
  { id: "motion-graphics", label: "Motion Graphics" },
];

export type Project = {
  slug: string;
  title: string;
  category: string;
  filter: ProjectFilter;
  /** Only when verified (e.g. a site confirmed live). */
  status?: string;
  summary?: string;
  cover: ProjectCover;
  /**
   * Work page only: changes to the cover there (e.g. a website screenshot
   * shown whole in a browser frame over a backdrop of its own colours).
   */
  workCover?: Partial<ProjectCover>;
  /** Artwork / video shown in the "View Project" lightbox. */
  gallery?: readonly ProjectMedia[];
  credits?: readonly ProjectCredit[];
  links?: {
    /** Public, working website. */
    live?: string;
    /** Internal case-study page. Omit until it exists. */
    caseStudy?: string;
  };
  titleTreatment: ProjectTitleTreatment;
  /** Shown on the homepage. */
  featured: boolean;
  /** Ascending display order. */
  order: number;
};

const studio = (role: string): ProjectCredit => ({ name: "Aqelvio Labs", role, relation: "studio" });
const acheva = (role: string): ProjectCredit => ({ name: "Acheva Graphix", role, relation: "collaborator" });

/**
 * Detail-page content (/work/[slug]). Every field but `intro` and
 * `overview` is optional and only rendered when present. Nothing here is a
 * brief, result or history unless it was supplied: overviews describe the
 * live site or the visible artwork. `brand` is the name shown on the work
 * (not a claim that it was a commissioned client).
 */
export type ProjectDetail = {
  intro: string;
  brand?: string;
  /** e.g. "Client project", only when known. */
  type?: string;
  /** Only when known. */
  date?: string;
  overview: readonly string[];
  objectives?: readonly string[];
  approach?: readonly string[];
  deliverables?: readonly string[];
};

const details: Record<string, ProjectDetail> = {
  "swagha-sports": {
    intro:
      "A website for Swagha Sports, an athlete management, sponsorship and scouting agency working in Ghana and the United States.",
    brand: "Swagha Sports",
    type: "Client project",
    overview: [
      "Swagha Sports discovers, supports and elevates athletes through management, sponsorships and scouting. The website introduces the agency and its founder, sets out those three services, and gives athletes a way in through the Join Swagha registration form.",
      "It also follows Swagha Fest 2026, the agency’s tournament, with a road-to-the-final timeline, results and a gallery for every matchday, alongside events, team and contact pages.",
      "The design is bold and sports-led: condensed uppercase headlines, black and off-white sections and red accents, opening on “Discover. Develop. Elevate.” over a stadium photograph.",
    ],
  },
  "pa-tech-services": {
    intro: "A website for PA Tech Services, an internet, security and IT services provider in Liberia.",
    brand: "PA Tech Services",
    overview: [
      "PA Tech Services installs internet and Wi-Fi, CCTV and alarm systems, and network cabling, and offers website design and IT support in Liberia. The website gives each of those services its own page, alongside About and Contact pages and a quote request.",
      "Its homepage opens on a dark server-room photograph under the line “Reliable technology built for everyday life.”",
    ],
  },
  "alpha-academy": {
    intro: "An online learning platform for senior high school students in Ghana, currently in development.",
    brand: "Alpha Academy",
    overview: [
      "Alpha Academy offers online courses for senior high school students in Ghana. The site brings together subject courses, including Mathematics, Integrated Science, Chemistry and Physics, with pricing, a referral programme, and student sign-up and login.",
      "Its homepage introduces the platform with a large serif “Learn Smarter. Grow Faster.” headline above a photograph of students in a classroom.",
    ],
  },
  "apiki-choco-crunch": {
    intro: "Poster and packaging artwork for Apiki Choco Crunch, a chocolate cereal.",
    brand: "Apiki",
    overview: [
      "A poster shows chocolate cereal rings and cocoa beans splashing from a bowl of milk, led by a smiling cocoa-pod mascot. The pouch design carries the same mascot and milk splash onto the packaging.",
    ],
  },
  "tgif-night-party": {
    intro: "An event poster for a TGIF night party at Kingsby Hotel.",
    overview: [
      "The poster is built around a stylised portrait in orange sunglasses, with entry marked “Rate: Free!!” and the essentials in one row beneath the title: Kingsby Hotel, 6th April, 8:30pm.",
    ],
  },
  "choco-buddy-animation": {
    intro: "A short product animation for Choco Buddy chocolate.",
    brand: "Choco Buddy",
    overview: [
      "In this 15-second animation, cocoa beans fly across a yellow field before the milk chocolate and strawberries & cream packs come into view.",
    ],
  },
  "apiki-cereal-logo": {
    intro: "The logo for Apiki Cereal.",
    brand: "Apiki",
    overview: [
      "Two wheat ears curve around the Apiki Cereal wordmark inside layered white rings, shown on blue. The mark appears on Apiki’s Nutri-Mix poster; it is shown here on its own.",
    ],
  },
  "nkate-cake-kan-brodea-posts": {
    intro: "Two social media posts for local snack brands, built on a shared layout.",
    overview: [
      "One post presents GID Nkate Cake, a peanut brittle, with a 30% off badge; the other presents Kan Brodea, roasted plantain with groundnuts. Both follow the same structure: a headline, the product on a plate, then delivery and ordering details.",
    ],
  },
  "skin-care-product-post": {
    intro: "A social media post for a seller of hair and skin care products.",
    overview: [
      "A portrait sits beside Dove hair care bottles under the line “Money can’t buy your happy, but can buy it.”, with the seller’s contact details below.",
    ],
  },
  "end-of-year-party-flyer": {
    intro: "A flyer for an End of Year Party at The Glorious Mega Church.",
    brand: "The Glorious Mega Church",
    overview: [
      "A cheering figure on torn teal paper carries the event’s energy, with the date, time and venue set in a panel below: 26th December 2025, 8am, at The Glorious Mega Church (Emmanuel Cathedral).",
    ],
  },
  "paers-soft-silk-animation": {
    intro: "A product animation introducing Paers Soft Silk Sensation disposable period panties.",
    brand: "Paers",
    overview: [
      "In this 47-second animation, an animated nurse introduces the product before the pack appears with its features, set against pink and roses.",
    ],
  },
  "rep-your-region-flyer": {
    intro: "A flyer for a church beach day, “GLGC goes to the beach”.",
    overview: [
      "Six coloured T-shirts, each labelled with a region, invite people to represent theirs. The flyer, for First Love Church Cape Coast, gives the venue, ChrisGee Beach, the 11am start and the games planned for the day.",
    ],
  },
  "sneaker-new-arrival-post": {
    intro: "A social media post announcing a new sneaker arrival.",
    overview: ["A light blue sneaker sits under “New arrival”, with a 50% off offer and an Order now button."],
  },
  "jvees-parlour-flyer": {
    intro: "A services flyer for Jvee’s Parlour.",
    brand: "Jvee’s Parlour",
    overview: [
      "The flyer lists the parlour’s services, including acrylic, ombré, manicure, pedicure, eyelashes and make-up, with its opening hours, photographs of the work and contact numbers.",
    ],
  },
  "living-dead-cover-art": {
    intro: "A magazine-style cover, “Living Dead: Face Off”.",
    overview: [
      "A portrait is split diagonally between natural colour and green, with half the face made up as a zombie. The photograph is credited on the artwork to KevWills Photography.",
    ],
  },
};

export const projects: readonly Project[] = [
  {
    slug: "swagha-sports",
    title: "Swagha Sports",
    category: "Website Design & Development",
    filter: "websites",
    status: "Live",
    cover: {
      src: "/images/projects/swagha-sports-desktop.jpg",
      width: 2400,
      height: 1500,
      alt: "Swagha Sports website homepage: “Discover. Develop. Elevate.” and an oversized SWAGHA wordmark over a stadium photograph, with a trophy image.",
      position: "50% 0%",
      fit: "cover",
      portrait: {
        src: "/images/projects/swagha-sports-mobile.jpg",
        width: 780,
        height: 1688,
        alt: "Swagha Sports website on a phone: the “Discover. Develop. Elevate.” headline, a trophy image and the Join Swagha button.",
        position: "50% 0%",
      },
    },
    workCover: {
      fit: "cover",
      portraitFit: "cover",
      position: "50% 0%",
      frame: "browser",
      backdrop: { image: "/images/projects/swagha-sports-frame-backdrop.jpg", color: "#1a0a0a" },
    },
    links: { live: "https://www.swaghasports.com/" },
    gallery: [
      { type: "image", src: "/images/projects/swagha-sports-desktop.jpg", width: 2400, height: 1500, alt: "Swagha Sports website homepage on desktop: “Discover. Develop. Elevate.” and an oversized SWAGHA wordmark over a stadium photograph." },
      { type: "image", src: "/images/projects/swagha-sports-fest.jpg", width: 2400, height: 1500, alt: "The Swagha Fest 2026 section of the Swagha Sports website: tournament dates, the final result and links to the gallery and the road to the final." },
      { type: "image", src: "/images/projects/swagha-sports-mobile.jpg", width: 780, height: 1688, alt: "Swagha Sports website homepage on a phone." },
    ],
    credits: [studio("Design & development")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: true,
    order: 0,
  },
  {
    slug: "pa-tech-services",
    title: "PA Tech Services",
    category: "Website / IT & Network Services",
    filter: "websites",
    status: "Live",
    cover: {
      src: "/images/projects/pa-tech-desktop-v2.jpg",
      width: 2400,
      height: 1500,
      alt: "PA Tech Services website homepage: “Reliable technology built for everyday life.” over a dark server-rack photograph.",
      position: "50% 0%",
      fit: "cover",
      portrait: {
        src: "/images/projects/pa-tech-mobile-v2.jpg",
        width: 780,
        height: 1688,
        alt: "PA Tech Services website on a phone: the homepage headline over a dark server-rack photograph.",
        position: "50% 0%",
      },
    },
    links: { live: "https://pa-tech-omega.vercel.app/" },
    workCover: {
      fit: "cover",
      portraitFit: "cover",
      position: "50% 0%",
      frame: "browser",
      backdrop: { image: "/images/projects/pa-tech-frame-backdrop.jpg", color: "#0b130f" },
    },
    gallery: [
      { type: "image", src: "/images/projects/pa-tech-desktop-v2.jpg", width: 2400, height: 1500, alt: "PA Tech Services website homepage on desktop: “Reliable technology built for everyday life.” over a dark server-rack photograph." },
      { type: "image", src: "/images/projects/pa-tech-mobile-v2.jpg", width: 780, height: 1688, alt: "PA Tech Services website homepage on a phone." },
    ],
    credits: [studio("Developed")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: true,
    order: 1,
  },
  {
    slug: "alpha-academy",
    title: "Alpha Academy",
    category: "Website / Online Learning Platform",
    filter: "websites",
    /* Publicly reachable, but still being built. */
    status: "In Development",
    cover: {
      src: "/images/projects/alpha-academy-desktop-v2.jpg",
      width: 2400,
      height: 1500,
      alt: "Alpha Academy website homepage: a large serif “Learn Smarter. Grow Faster.” headline above a photograph of students studying.",
      position: "50% 0%",
      fit: "cover",
      portrait: {
        src: "/images/projects/alpha-academy-mobile-v2.jpg",
        width: 780,
        height: 1688,
        alt: "Alpha Academy website on a phone: the serif “Learn Smarter. Grow Faster.” headline, a Get Started button and course stats.",
        position: "50% 0%",
      },
    },
    links: { live: "https://alpha-academy-gules.vercel.app/" },
    workCover: {
      fit: "cover",
      portraitFit: "cover",
      position: "50% 0%",
      frame: "browser",
      backdrop: { image: "/images/projects/alpha-academy-frame-backdrop.jpg", color: "#1b2147" },
    },
    gallery: [
      { type: "image", src: "/images/projects/alpha-academy-desktop-v2.jpg", width: 2400, height: 1500, alt: "Alpha Academy website homepage on desktop: a large serif “Learn Smarter. Grow Faster.” headline above a photograph of students studying." },
      { type: "image", src: "/images/projects/alpha-academy-mobile-v2.jpg", width: 780, height: 1688, alt: "Alpha Academy website homepage on a phone." },
    ],
    credits: [studio("Developed")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    /* In development: kept in the portfolio, replaced on the homepage by
       Swagha Sports, a completed client website. */
    featured: false,
    order: 2,
  },
  {
    slug: "apiki-choco-crunch",
    title: "Apiki Choco Crunch",
    category: "Brand & Packaging Design",
    filter: "brand-identity",
    cover: {
      src: "/images/projects/apiki-choco-crunch-poster-v2.jpg",
      width: 1272,
      height: 2000,
      alt: "Apiki Choco Crunch poster: chocolate cereal rings and cocoa beans splashing from a bowl of milk, with a smiling cocoa-pod mascot.",
      fit: "contain",
      backdrop: { image: "/images/projects/apiki-choco-crunch-backdrop.jpg", color: "#7a4214" },
    },
    gallery: [
      {
        type: "image",
        src: "/images/projects/apiki-choco-crunch-poster-v2.jpg",
        width: 1272,
        height: 2000,
        alt: "Apiki Choco Crunch poster: chocolate cereal rings and cocoa beans splashing from a bowl of milk, with a smiling cocoa-pod mascot.",
        source: "APIKI CHOCO CRUNCH 2.jpg",
      },
      {
        type: "image",
        src: "/images/projects/apiki-choco-crunch-pack.jpg",
        width: 626,
        height: 626,
        alt: "Apiki Choco Crunch cereal pouch mock-up with the cocoa-pod mascot and a milk splash.",
        source: "choco pillow.jpg",
      },
    ],
    credits: [acheva("Design")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: true,
    order: 3,
  },
  {
    slug: "tgif-night-party",
    title: "TGIF Night Party",
    category: "Event Poster / Social Media",
    filter: "flyers-posters",
    cover: {
      src: "/images/projects/tgif-night-party-poster.jpg",
      width: 1297,
      height: 1728,
      alt: "TGIF Night Party poster: a stylised portrait in orange sunglasses, “Rate: Free!!”, with location, date and time below.",
      fit: "contain",
      backdrop: { image: "/images/projects/tgif-night-party-backdrop.jpg", color: "#8a2a0a" },
    },
    gallery: [
      {
        type: "image",
        src: "/images/projects/tgif-night-party-poster.jpg",
        width: 1297,
        height: 1728,
        alt: "TGIF Night Party poster: a stylised portrait in orange sunglasses, “Rate: Free!!”, location Kingsby Hotel, 6th April, 8:30pm.",
        source: "NIGHT PARTY.jpg",
      },
    ],
    credits: [acheva("Design")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: true,
    order: 4,
  },
  {
    slug: "choco-buddy-animation",
    title: "Choco Buddy",
    category: "Motion Graphics / Product Animation",
    filter: "motion-graphics",
    cover: {
      src: "/images/projects/choco-buddy-animation-poster.jpg",
      width: 1920,
      height: 1080,
      alt: "Choco Buddy milk chocolate and strawberries & cream packs on a yellow background with cocoa beans.",
      fit: "cover",
      portraitFit: "contain",
      backdrop: { color: "#f3d236" },
    },
    gallery: [
      {
        type: "video",
        src: "/media/projects/choco-buddy-animation.mp4",
        width: 1920,
        height: 1080,
        label: "Choco Buddy product animation: cocoa beans fly past, then the milk chocolate and strawberries & cream packs appear.",
        poster: "/images/projects/choco-buddy-animation-poster.jpg",
        preview: true,
        source: "COCOA ANIMATION.mp4",
      },
    ],
    credits: [acheva("Motion design")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: true,
    order: 5,
  },

  /* ---- Further Acheva Graphix work: on the Work page only. ---- */
  {
    slug: "apiki-cereal-logo",
    title: "Apiki Cereal Logo",
    category: "Logo Design",
    filter: "logo-design",
    cover: {
      src: "/images/projects/apiki-cereal-logo.jpg",
      width: 900,
      height: 860,
      alt: "Apiki Cereal logo: two orange wheat ears curving around the wordmark inside white rings, on blue.",
      fit: "contain",
      backdrop: { image: "/images/projects/apiki-cereal-logo-backdrop.jpg", color: "#365fe2" },
    },
    gallery: [
      {
        type: "image",
        src: "/images/projects/apiki-cereal-logo.jpg",
        width: 900,
        height: 860,
        alt: "Apiki Cereal logo: two orange wheat ears curving around the wordmark inside white rings, on blue.",
        source: "APIKI NUTRI-MIX 1.jpg (logo area only)",
      },
    ],
    credits: [acheva("Design")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: false,
    order: 6,
  },
  {
    slug: "nkate-cake-kan-brodea-posts",
    title: "Nkate Cake & Kan Brodea Posts",
    category: "Social Media",
    filter: "social-media",
    cover: {
      src: "/images/projects/gid-nkate-cake-post.jpg",
      width: 1600,
      height: 1606,
      alt: "Social post for GID Nkate Cake: peanut brittle bars on a white plate, “Feel the crunch”, a 30% off badge and delivery details on yellow.",
      fit: "contain",
      backdrop: { image: "/images/projects/gid-nkate-cake-post-backdrop.jpg", color: "#c99f00" },
    },
    gallery: [
      {
        type: "image",
        src: "/images/projects/gid-nkate-cake-post.jpg",
        width: 1600,
        height: 1606,
        alt: "Social post for GID Nkate Cake: peanut brittle bars on a white plate, “Feel the crunch”, a 30% off badge and delivery details on yellow.",
        source: "NKATE CAKE PICTORIAL.jpg",
      },
      {
        type: "image",
        src: "/images/projects/kan-brodea-post.jpg",
        width: 1600,
        height: 1716,
        alt: "Social post for Kan Brodea: roasted plantain with groundnuts on a white plate, “Very delicious”, “Made with real plantain” and delivery details on a dark chalkboard background.",
        source: "kan brodea.jpg",
      },
    ],
    credits: [acheva("Design")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: false,
    order: 7,
  },
  {
    slug: "skin-care-product-post",
    title: "Skin Care Product Post",
    category: "Social Media",
    filter: "social-media",
    cover: {
      src: "/images/projects/skin-care-product-post.jpg",
      width: 864,
      height: 1080,
      alt: "Social post for skin care products: a portrait beside Dove hair care bottles, “Money can’t buy your happy, but can buy it.”",
      fit: "contain",
      backdrop: { image: "/images/projects/skin-care-product-post-backdrop.jpg", color: "#a9c98a" },
    },
    gallery: [
      {
        type: "image",
        src: "/images/projects/skin-care-product-post.jpg",
        width: 864,
        height: 1080,
        alt: "Social post for skin care products: a portrait beside Dove hair care bottles, “Money can’t buy your happy, but can buy it.”, with contact details.",
        source: "JPEG image-420B-B05C-48-15.jpeg",
      },
    ],
    credits: [acheva("Design")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: false,
    order: 8,
  },
  {
    slug: "end-of-year-party-flyer",
    title: "End of Year Party Flyer",
    category: "Event Flyer",
    filter: "flyers-posters",
    cover: {
      src: "/images/projects/end-of-year-party-flyer.jpg",
      width: 1600,
      height: 2006,
      alt: "End of Year Party flyer for The Glorious Mega Church: a cheering woman on torn teal paper, with the date, time and venue.",
      fit: "contain",
      backdrop: { image: "/images/projects/end-of-year-party-flyer-backdrop.jpg", color: "#2a8f88" },
    },
    gallery: [
      {
        type: "image",
        src: "/images/projects/end-of-year-party-flyer.jpg",
        width: 1600,
        height: 2006,
        alt: "End of Year Party flyer for The Glorious Mega Church: a cheering woman on torn teal paper, 26th December 2025, 8am, at The Glorious Mega Church (Emmanuel Cathedral).",
        source: "END OF YEAR.jpg",
      },
    ],
    credits: [acheva("Design")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: false,
    order: 9,
  },
  {
    slug: "paers-soft-silk-animation",
    title: "Paers Soft Silk Sensation",
    category: "Motion Graphics / Product Animation",
    filter: "motion-graphics",
    cover: {
      src: "/images/projects/paers-soft-silk-animation-poster.jpg",
      width: 1920,
      height: 1080,
      alt: "Paers Soft Silk Sensation disposable period panties pack on a pink background with roses.",
      fit: "cover",
      portraitFit: "contain",
      backdrop: { color: "#e8438f" },
    },
    gallery: [
      {
        type: "video",
        src: "/media/projects/paers-soft-silk-animation.mp4",
        width: 1920,
        height: 1080,
        label: "Paers Soft Silk Sensation animation: an animated nurse introduces the product, then the pack appears with its features.",
        poster: "/images/projects/paers-soft-silk-animation-poster.jpg",
        preview: true,
        source: "SANITARY PAD MOTION.mp4",
      },
    ],
    credits: [acheva("Motion design")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: false,
    order: 10,
  },
  {
    slug: "rep-your-region-flyer",
    title: "Rep Your Region",
    category: "Event Flyer",
    filter: "flyers-posters",
    cover: {
      src: "/images/projects/rep-your-region-flyer.jpg",
      width: 1200,
      height: 1500,
      alt: "“GLGC goes to the beach — Rep your region” flyer: six coloured T-shirts labelled with region names, venue, time and games.",
      fit: "contain",
      backdrop: { image: "/images/projects/rep-your-region-flyer-backdrop.jpg", color: "#e8a23a" },
    },
    gallery: [
      {
        type: "image",
        src: "/images/projects/rep-your-region-flyer.jpg",
        width: 1200,
        height: 1500,
        alt: "“GLGC goes to the beach — Rep your region” flyer for First Love Church Cape Coast: six coloured T-shirts labelled with region names, Saturday, ChrisGee Beach, 11am, and a list of games.",
        source: "REP REGION 2.jpg",
      },
    ],
    credits: [acheva("Design")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: false,
    order: 11,
  },
  {
    slug: "sneaker-new-arrival-post",
    title: "Sneaker New Arrival Post",
    category: "Social Media",
    filter: "social-media",
    cover: {
      src: "/images/projects/sneaker-new-arrival-post.jpg",
      width: 1600,
      height: 1608,
      alt: "Social post for a sneaker seller: a light blue sneaker under “New arrival — Shoe”, “Come & get 50% off” and an Order now button.",
      fit: "contain",
      backdrop: { image: "/images/projects/sneaker-new-arrival-post-backdrop.jpg", color: "#3f73b4" },
    },
    gallery: [
      {
        type: "image",
        src: "/images/projects/sneaker-new-arrival-post.jpg",
        width: 1600,
        height: 1608,
        alt: "Social post for a sneaker seller: a light blue sneaker under “New arrival — Shoe”, “Come & get 50% off” and an Order now button.",
        source: "SHOE BRAND.jpg",
      },
    ],
    credits: [acheva("Design")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: false,
    order: 12,
  },
  {
    slug: "jvees-parlour-flyer",
    title: "Jvee’s Parlour",
    category: "Services Flyer",
    filter: "flyers-posters",
    cover: {
      src: "/images/projects/jvees-parlour-flyer.jpg",
      width: 1600,
      height: 1890,
      alt: "Jvee’s Parlour services flyer: a make-up portrait, services list, opening times and photos of manicure, eyelashes and pedicure, on pink and purple.",
      fit: "contain",
      backdrop: { image: "/images/projects/jvees-parlour-flyer-backdrop.jpg", color: "#7b4a8d" },
    },
    gallery: [
      {
        type: "image",
        src: "/images/projects/jvees-parlour-flyer.jpg",
        width: 1600,
        height: 1890,
        alt: "Jvee’s Parlour services flyer: acrylic, ombré, pedicure, manicure, eyelashes and make-up, open 8:30am to 7:00pm, with photos of manicure, eyelashes and pedicure and phone numbers.",
        source: "JBEES PARLOUR.jpg",
      },
    ],
    credits: [acheva("Design")],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: false,
    order: 13,
  },
  {
    slug: "living-dead-cover-art",
    title: "Living Dead Cover Art",
    category: "Cover Design",
    filter: "flyers-posters",
    cover: {
      src: "/images/projects/living-dead-cover.jpg",
      width: 836,
      height: 1080,
      alt: "“Living Dead — Face off” magazine-style cover: a portrait split diagonally between natural colour and green, half the face made up as a zombie.",
      fit: "contain",
      backdrop: { image: "/images/projects/living-dead-cover-backdrop.jpg", color: "#1d3a14" },
    },
    gallery: [
      {
        type: "image",
        src: "/images/projects/living-dead-cover.jpg",
        width: 836,
        height: 1080,
        alt: "“Living Dead — Face off” magazine-style cover: a portrait split diagonally between natural colour and green, half the face made up as a zombie, with a barcode.",
        source: "GIDEON'S WORK.jpg",
      },
    ],
    credits: [acheva("Design"), { name: "KevWills Photography", role: "Photograph", relation: "credited" }],
    titleTreatment: { color: "#ffffff", blend: "exclusion" },
    featured: false,
    order: 14,
  },
];

/** The homepage selection, in display order. */
export const featuredProjects: readonly Project[] = projects
  .filter((project) => project.featured)
  .sort((a, b) => a.order - b.order);

/** The full portfolio for the Work page, in display order. */
export const workProjects: readonly Project[] = [...projects].sort((a, b) => a.order - b.order);

/** Filters that contain at least one project, in their set order. */
export const activeProjectFilters = projectFilters.filter((filter) =>
  projects.some((project) => project.filter === filter.id),
);

/** Detail-page content for a project (every project has one). */
export function projectDetail(slug: string): ProjectDetail | undefined {
  return details[slug];
}

/** The project's internal detail page. */
export function projectHref(project: Pick<Project, "slug">): string {
  return `/work/${project.slug}`;
}

/** The project after this one in the portfolio, wrapping round. */
export function nextProject(slug: string): Project {
  const index = workProjects.findIndex((project) => project.slug === slug);
  return workProjects[(index + 1) % workProjects.length];
}

/** The muted in-panel preview, if a project has one. */
export function previewVideo(project: Project) {
  return project.gallery?.find((item) => item.type === "video" && item.preview) as
    | Extract<ProjectMedia, { type: "video" }>
    | undefined;
}

/** Section introduction (RecentProjects). */
export const recentProjectsIntro = {
  heading: ["A Few Of Our", "Recent Projects"],
  body: "Selected work across design, software, and digital experiences.",
  /** Linked only when the destination exists; /projects does not yet. */
  href: undefined as string | undefined,
} as const;

/**
 * Motion, as read from the reference's own code (Origin Studio, workText /
 * workClipPath / moveTag) and confirmed by live sampling at 1440×900 and
 * 390×844, forwards and backwards:
 *
 *   - Each panel is one viewport tall; the image frame is 90vw × 90vh.
 *   - The frame's clip-path is scrubbed (lag 0.5s) from the panel's top
 *     entering the viewport to its bottom leaving it: a trapezoid open at
 *     the bottom → the full frame (panel top at viewport top) → a
 *     trapezoid open at the top.
 *   - The repeated title slides along one shallow arch (the reference's
 *     path, viewBox 0 -140 1515 300): startOffset 0 → −82% of the path
 *     length over the first 1200px after the panel enters (lag 1.1s).
 *   - On hover, the action tag fades in (0.5s) and follows the pointer
 *     (quickTo, 1s, power1).
 */
export const projectMotion = {
  path: "M0 90 C500 -55 1010 -58 1515 90",
  viewBox: "0 -140 1515 300",
  clip: {
    enter: "polygon(25% 25%, 75% 40%, 100% 100%, 0% 100%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    exit: "polygon(0% 0%, 100% 0%, 75% 60%, 25% 75%)",
    scrub: 0.5,
  },
  title: { travel: 0.82, distance: 1200, scrub: 1.1, repeats: 14 },
  tag: { fade: 0.5, follow: 1, ease: "power1" },
} as const;
