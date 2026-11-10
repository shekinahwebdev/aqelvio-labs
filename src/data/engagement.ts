import { contactEnquiryId, primaryCta } from "@/config/navigation";
import { collaborator } from "@/data/service-categories";

/**
 * Pricing & Engagement content (/pricing). Everything here describes how
 * work is scoped, quoted and supported; it publishes no prices.
 *
 * Rules for this file:
 *   - No amounts, starting prices, discounts or tiers unless approved.
 *     `startingPrice` stays null until a price is approved; while it is
 *     null the page says "Custom Quote" (or "Contact for Pricing").
 *   - No universal deposit, timeline, response time, uptime or warranty
 *     period: payment milestones, support terms and any warranty are set
 *     in each proposal and agreement, and the copy says so.
 *   - No standalone UI/UX design: screen and interface design is part of
 *     a development project's agreed scope where needed.
 */

/** Where every quote-related action goes (the enquiry form). */
export const quoteHref = `${primaryCta.href}#${contactEnquiryId}`;

export const pricingHero = {
  eyebrow: "Pricing & Engagement",
  heading: ["Flexible Engagements.", "Transparent Pricing."],
  body: "Every project is different. We tailor our development, hosting and support arrangements to your business goals, technical requirements and long-term needs.",
  note: "Most projects are custom-quoted, based on scope, complexity, integrations and technical requirements.",
  primary: { label: "Request a Quote", href: quoteHref },
  secondary: { label: "Explore Our Services", href: "/services" },
} as const;

/* ------------------------------------------------------------------ */
/* Engagement models                                                   */
/* ------------------------------------------------------------------ */

export type EngagementModel = {
  id: string;
  number: string;
  title: string;
  forWhom: string;
  includesLabel: string;
  includes: readonly string[];
  pricing: string;
  pricingNote: string;
  cta: { label: string; href: string };
};

export const engagementModels: readonly EngagementModel[] = [
  {
    id: "build-handover",
    number: "01",
    title: "Build & Handover",
    forWhom: "For clients who want us to build their product and hand over the completed solution.",
    includesLabel: "Includes, subject to agreed scope",
    includes: [
      "Requirements analysis",
      "Screen and interface design within the build, where needed",
      "Frontend development",
      "Backend development",
      "Database design",
      "Third-party integrations",
      "Testing and deployment",
      "Technical documentation",
      "Handover, and any warranty support set out in your agreement",
    ],
    pricing: "Custom Project Quote",
    pricingNote: "Hosting, domains, third-party subscriptions and ongoing maintenance are quoted separately.",
    cta: { label: "Discuss Your Project", href: quoteHref },
  },
  {
    id: "build-maintain",
    number: "02",
    title: "Build & Maintain",
    forWhom: "For clients who want ongoing technical support after launch.",
    includesLabel: "The agreed development scope, plus an optional maintenance agreement covering",
    includes: [
      "Routine software updates",
      "Security patches",
      "Monitoring and incident investigation",
      "Backup verification",
      "Agreed technical support",
      "Periodic maintenance reviews",
    ],
    pricing: "Project Fee + Maintenance Plan",
    pricingNote: "The client generally pays hosting providers directly.",
    cta: { label: "Request a Maintenance Quote", href: quoteHref },
  },
  {
    id: "fully-managed",
    number: "03",
    title: "Fully Managed",
    forWhom: "For clients who prefer Aqelvio Labs to coordinate the technical operations of their application.",
    includesLabel: "May include",
    includes: [
      "Development and deployment",
      "Hosting setup and management",
      "Infrastructure monitoring",
      "Database and backup management",
      "Routine maintenance",
      "Technical support",
      "Coordination of hosting provider payments",
    ],
    pricing: "Project Fee + Infrastructure Costs + Management Fee",
    pricingNote: "Availability and support commitments depend on the signed service agreement.",
    cta: { label: "Discuss Managed Services", href: quoteHref },
  },
];

/** Side-by-side comparison of the three models (same order as above). */
export const engagementComparison = {
  heading: "Compare the engagement models",
  rows: [
    {
      label: "Development",
      values: ["Agreed project scope", "Agreed project scope", "Agreed project scope"],
    },
    {
      label: "After launch",
      values: ["Handed over to you", "Maintained under a recurring agreement", "Operated and maintained by us"],
    },
    {
      label: "Hosting account",
      values: ["Yours; set up and run by you", "Generally yours", "Set up and managed by us, as agreed"],
    },
    {
      label: "Who pays hosting providers",
      values: ["You, directly", "Generally you, directly", "We can, invoicing you as agreed"],
    },
    {
      label: "Monitoring and updates",
      values: ["Not included after handover", "Included in the maintenance plan", "Included in the management service"],
    },
    {
      label: "How it is priced",
      values: [
        "Custom project quote",
        "Project fee + maintenance plan",
        "Project fee + infrastructure costs + management fee",
      ],
    },
  ],
  note: "Exact responsibilities are set out in each proposal and service agreement.",
} as const;

/* ------------------------------------------------------------------ */
/* What goes into a quote                                              */
/* ------------------------------------------------------------------ */

export const quoteComponents = {
  heading: "What Goes Into Your Project Quote?",
  intro:
    "A quote is built from the work your project actually needs. These are the main components we consider:",
  items: [
    { title: "Discovery and requirements analysis", text: "Understanding your goals, users and constraints, and agreeing what will be built." },
    { title: "Frontend development", text: "The pages and screens people use, designed and built within the agreed scope." },
    { title: "Backend and API engineering", text: "The services and logic behind the product, and how it connects to other systems." },
    { title: "Database architecture and implementation", text: "How your information is structured, stored and kept consistent." },
    { title: "Third-party integrations", text: "Payments, SMS, email, maps and other services your product relies on." },
    { title: "Testing and quality assurance", text: "Checking that features work as agreed across the devices and browsers that matter." },
    { title: "Deployment and initial configuration", text: "Putting the product live and configuring its environment for launch." },
  ],
  notes: [
    "Not every project needs every component. A simple marketing website may not need a custom database, while a school management platform may need authentication, role-based permissions, reporting, file storage and more involved infrastructure.",
    "These are the parts of the work, not separate charges: where a fixed project fee is agreed, it covers the components in that scope.",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Development vs keeping the product online                           */
/* ------------------------------------------------------------------ */

export const costTypes = {
  heading: ["Development Is One Cost.", "Keeping Your Product Online Is Another."],
  intro: "Three kinds of cost go into a live product. Your proposal lists each one separately.",
  items: [
    {
      title: "Development Fee",
      frequency: "One-time or milestone-based",
      text: "Payment for designing, building, testing and initially deploying the product.",
    },
    {
      title: "Domain & Infrastructure",
      frequency: "Recurring, paid to third parties",
      text: "Charges for domain registration, hosting, databases, storage, email, SMS, APIs and other required services. Domain renewals are generally annual; hosting and usage-based services may be billed monthly or annually.",
    },
    {
      title: "Maintenance & Management",
      frequency: "Recurring professional service",
      text: "Ongoing technical support, monitoring, updates and infrastructure administration, under a separate agreement.",
    },
  ],
  changes: {
    heading: "Why hosting costs can change",
    reasons: [
      "Provider pricing changes",
      "How much the application is used",
      "Traffic",
      "Storage",
      "Exchange rates",
      "Infrastructure upgrades",
    ],
    note: "Infrastructure costs are estimates, not fixed prices, unless a specific fixed-price arrangement is agreed in writing.",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Hosting ownership and billing                                       */
/* ------------------------------------------------------------------ */

export const hostingOptions = {
  heading: "Who Holds the Hosting Account?",
  intro: "There are two ways to run the infrastructure behind your product.",
  options: [
    {
      id: "client-owned",
      title: "Client-Owned Hosting",
      tag: "Preferred for substantial custom business applications",
      points: [
        "You own the domain, the production hosting account and your business data.",
        "You pay the infrastructure provider directly.",
        "Aqelvio Labs can configure and maintain the infrastructure under an agreed service arrangement.",
      ],
    },
    {
      id: "agency-managed",
      title: "Agency-Managed Hosting",
      tag: "For clients who want one point of contact",
      points: [
        "Aqelvio Labs coordinates hosting operations and, where agreed, pays providers on your behalf.",
        "You receive recurring invoices for infrastructure charges and the agreed management fee.",
        "Choosing managed hosting does not mean giving up your domain or your data.",
      ],
    },
  ],
  agreement: {
    heading: "A managed arrangement sets out",
    items: [
      "Cost estimates",
      "Billing frequency",
      "Payment deadlines",
      "Spending thresholds",
      "How changes in provider charges are handled",
      "Data and domain ownership",
      "Migration and handover procedures",
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/* How we work                                                         */
/* ------------------------------------------------------------------ */

export const howWeWork = {
  heading: "How We Work",
  steps: [
    { title: "Discover", text: "We learn about your organisation, your users and what you want to achieve." },
    { title: "Scope", text: "We agree what will be built, what is out of scope, and how success will be judged." },
    { title: "Design", text: "We plan the structure and screens, and agree them with you before development." },
    { title: "Develop", text: "We build in stages, sharing progress so you can give feedback along the way." },
    { title: "Test", text: "We check that features work as agreed on the devices and browsers that matter." },
    { title: "Launch", text: "We deploy the product, configure its environment and hand over what you need." },
    { title: "Support", text: "Where agreed, we maintain, monitor and improve the product after launch." },
  ],
  proposal:
    "Before work begins, a formal proposal sets out the deliverables, timeline, payment milestones, third-party costs and support arrangements for your project.",
} as const;

/* ------------------------------------------------------------------ */
/* Offerings, ready for approved prices                                */
/* ------------------------------------------------------------------ */

/** An approved price. Add one only once it has been approved. */
export type ApprovedPrice = {
  currency: "GHS" | "USD";
  amount: number;
  /** e.g. "Starting from"; shown before the amount. */
  label: string;
};

export type PricingModel = "fixed-project" | "milestone" | "recurring-monthly" | "recurring-annual" | "custom";

export type PricedOffering = {
  id: string;
  name: string;
  description: string;
  deliverables: readonly string[];
  pricingModel: PricingModel;
  /** null until a price is approved: the page then shows `fallback`. */
  startingPrice: ApprovedPrice | null;
  fallback: "Custom Quote" | "Contact for Pricing";
  exclusions: readonly string[];
  /** Delivered with a collaborator, if so. */
  collaboration?: string;
  cta: { label: string; href: string };
};

export const pricingModelLabels: Record<PricingModel, string> = {
  "fixed-project": "Fixed project fee",
  milestone: "Milestone-based project fee",
  "recurring-monthly": "Recurring monthly fee",
  "recurring-annual": "Recurring annual fee",
  custom: "Custom quote",
};

const thirdParty = "Domain, hosting and third-party subscription costs";

export const pricedOfferings: readonly PricedOffering[] = [
  {
    id: "business-website",
    name: "Business Website Development",
    description: "A responsive website for your business, built around your content and goals.",
    deliverables: ["Responsive page design and build", "Content structure", "Contact and enquiry forms", "Launch on your hosting"],
    pricingModel: "milestone",
    startingPrice: null,
    fallback: "Custom Quote",
    exclusions: [thirdParty, "Written content and images (supplied by you)", "Ongoing maintenance"],
    cta: { label: "Request a Quote", href: quoteHref },
  },
  {
    id: "ecommerce",
    name: "E-commerce Development",
    description: "An online shop with product listings, cart, checkout and order management.",
    deliverables: ["Store design and build", "Product catalogue setup", "Payment gateway integration", "Order management"],
    pricingModel: "milestone",
    startingPrice: null,
    fallback: "Custom Quote",
    exclusions: [thirdParty, "Payment provider fees", "Product data entry, unless agreed", "Ongoing maintenance"],
    cta: { label: "Request a Quote", href: quoteHref },
  },
  {
    id: "mobile-app",
    name: "Mobile Application Development",
    description:
      "Mobile applications designed and developed around your users, workflows and business requirements. Scope, platform support and delivery arrangements are agreed during discovery.",
    deliverables: ["Discovery and scope", "App screens within the agreed scope", "App development", "Testing and release support"],
    pricingModel: "milestone",
    startingPrice: null,
    fallback: "Custom Quote",
    exclusions: [thirdParty, "App store developer account fees", "Ongoing maintenance"],
    cta: { label: "Request a Quote", href: quoteHref },
  },
  {
    id: "graphic-design-branding",
    name: "Graphic Design & Branding",
    description: "Brand identity, logos, social media and print design, and motion graphics.",
    deliverables: ["Agreed per project"],
    pricingModel: "custom",
    startingPrice: null,
    fallback: "Contact for Pricing",
    exclusions: ["Printing and production costs"],
    collaboration: `May be provided in collaboration with ${collaborator.name}, ${collaborator.description}. Packages and pricing are not published until the scope and terms are confirmed with them.`,
    cta: { label: "Ask About Design Work", href: quoteHref },
  },
  {
    id: "maintenance",
    name: "Software Maintenance",
    description: "Ongoing care for a live website or application after launch.",
    deliverables: ["Routine updates", "Security patches", "Monitoring and incident investigation", "Backup verification", "Agreed technical support"],
    pricingModel: "recurring-monthly",
    startingPrice: null,
    fallback: "Custom Quote",
    exclusions: [thirdParty, "New features (quoted separately)"],
    cta: { label: "Request a Maintenance Quote", href: quoteHref },
  },
  {
    id: "managed-hosting",
    name: "Managed Hosting",
    description: "Hosting set up, run and coordinated for you, with provider payments handled as agreed.",
    deliverables: ["Hosting setup and management", "Infrastructure monitoring", "Database and backup management", "Provider payment coordination"],
    pricingModel: "recurring-monthly",
    startingPrice: null,
    fallback: "Custom Quote",
    exclusions: ["Infrastructure charges themselves (invoiced separately, as agreed)"],
    cta: { label: "Discuss Managed Services", href: quoteHref },
  },
];

/** "GH₵ 1,000" style display for an approved price. */
export function formatApprovedPrice(price: ApprovedPrice): string {
  const amount = new Intl.NumberFormat("en-GH", { maximumFractionDigits: 0 }).format(price.amount);
  return `${price.label} ${price.currency === "GHS" ? "GH₵" : "US$"} ${amount}`;
}

export const offeringsIntro = {
  heading: "Services and How They Are Priced",
  intro: "Prices are prepared for each project. Open a service to see what it usually covers and what is quoted separately.",
} as const;

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export const pricingFaqIntro = {
  heading: "Pricing FAQs",
  body: "Common questions about costs, hosting, ownership and support.",
} as const;

export const pricingFaqs = [
  {
    question: "How much does a website cost?",
    answer:
      "It depends on the number of pages, the content, and features such as e-commerce, bookings or integrations. We don’t publish fixed prices; share your brief and we’ll prepare a quote for your project.",
  },
  {
    question: "How much does a custom software platform cost?",
    answer:
      "It depends on the users and roles involved, the features, integrations, data and reporting needed, and the infrastructure it runs on. Larger platforms usually start with discovery, so the quote reflects what will actually be built.",
  },
  {
    question: "Do you develop mobile applications?",
    answer:
      "Yes. We design and develop mobile applications around your users, workflows and business requirements. Scope, platform support and delivery arrangements are agreed during discovery.",
  },
  {
    question: "Are hosting and domain costs included?",
    answer:
      "Not in the development fee. Domains, hosting and other third-party services are recurring costs, listed separately in your proposal.",
  },
  {
    question: "Who owns the website or software after completion?",
    answer:
      "Ownership of the finished work, including source code, is set out in your agreement. We recommend that your domain and production hosting accounts are held in your name.",
  },
  {
    question: "Can Aqelvio Labs manage hosting for us?",
    answer:
      "Yes, under an agency-managed arrangement. We coordinate hosting operations and, where agreed, pay providers on your behalf, then invoice you for infrastructure charges and the agreed management fee.",
  },
  {
    question: "What happens if our hosting bill increases?",
    answer:
      "Provider charges can change with pricing, usage, traffic, storage and exchange rates. If you hold the account, the provider bills you directly. Under a managed arrangement, the agreement sets out how changes are notified and approved, including spending thresholds.",
  },
  {
    question: "Do you offer maintenance after launch?",
    answer:
      "Yes, through an optional maintenance agreement. What it covers, such as updates, security patches, monitoring and support, is set out in that agreement.",
  },
  {
    question: "Can we request additional features later?",
    answer: "Yes. New features are scoped and quoted separately, either as a change request or as a new project phase.",
  },
  {
    question: "How do project payments work?",
    answer:
      "Your proposal sets out the fee and the payment milestones for your project. There is no single deposit or schedule that applies to every project.",
  },
  {
    question: "Can we use our existing domain or hosting provider?",
    answer:
      "Often, yes. We review your existing domain and hosting during discovery to confirm they meet the project’s technical requirements.",
  },
  {
    question: "Do you offer UI/UX and graphic design services?",
    answer: `We don’t offer UI/UX design as a standalone service; the screens of a website or application are designed as part of its development where needed. Branding, graphic design and motion graphics may be provided in collaboration with ${collaborator.name}, ${collaborator.description}.`,
  },
] as const;
