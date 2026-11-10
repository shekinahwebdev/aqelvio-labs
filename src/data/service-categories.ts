/**
 * What Aqelvio Labs offers, grouped into categories: the overview on
 * /services, the enquiry form's service choices and the pricing page all
 * read from here. The design disciplines in detail (with real work) stay
 * in service-catalog.ts.
 *
 * Only what is true belongs here:
 *   - No standalone UI/UX design and no photography: neither is offered.
 *     Screen and interface design is part of a development project's
 *     agreed scope where it is needed.
 *   - Mobile development is offered; there are no shipped apps to show, so
 *     nothing here claims or implies any.
 *   - Branding, graphic design and motion graphics may be delivered with
 *     Acheva Graphix, an independently operated creative brand (not part of
 *     Aqelvio Labs). `delivery` says so wherever the category appears.
 */

export type ServiceDelivery =
  | { kind: "studio" }
  | { kind: "collaboration"; partner: string; note: string };

export type ServiceCategory = {
  /** Stable id: anchor on /services (#id) and the enquiry form's value. */
  id: string;
  title: string;
  summary: string;
  offerings: readonly string[];
  delivery: ServiceDelivery;
  /** Where the detail for this category lives, if anywhere. */
  detailHref?: string;
};

export const collaborator = {
  name: "Acheva Graphix",
  description: "an independently operated creative brand",
} as const;

export const serviceCategories: readonly ServiceCategory[] = [
  {
    id: "website-development",
    title: "Website Development",
    summary: "Responsive websites that present what you do clearly and lead visitors to the next step.",
    offerings: [
      "Business websites",
      "Corporate websites",
      "Landing pages",
      "E-commerce websites",
      "Website redesign and modernisation",
    ],
    delivery: { kind: "studio" },
  },
  {
    id: "custom-software",
    title: "Custom Software Development",
    summary: "Web applications built around how your organisation works, from internal tools to platforms your customers use.",
    offerings: [
      "Business management systems",
      "School and education platforms",
      "Internal dashboards",
      "Client portals",
      "Custom web applications",
    ],
    delivery: { kind: "studio" },
  },
  {
    id: "mobile-app-development",
    title: "Mobile Application Development",
    summary:
      "Mobile applications designed and developed around your users, workflows and business requirements. Scope, platform support and delivery arrangements are agreed during discovery.",
    offerings: [
      "Cross-platform mobile applications",
      "Mobile interfaces for existing platforms",
      "API-connected mobile applications",
      "Mobile app maintenance",
    ],
    delivery: { kind: "studio" },
  },
  {
    id: "ai-automation",
    title: "AI Solutions & Automation",
    summary: "Practical AI features and automated workflows that take repetitive work off your team.",
    offerings: [
      "AI integrations",
      "Workflow automation",
      "AI-powered features",
      "Internal productivity tools",
      "Intelligent information systems",
    ],
    delivery: { kind: "studio" },
  },
  {
    id: "backend-cloud",
    title: "Backend & Cloud Engineering",
    summary: "The services, data and infrastructure behind your product, set up to be secure and maintainable.",
    offerings: [
      "REST APIs and integrations",
      "Database architecture",
      "Authentication and authorisation",
      "Cloud deployment",
      "Monitoring and infrastructure configuration",
    ],
    delivery: { kind: "studio" },
  },
  {
    id: "graphic-design-branding",
    title: "Graphic Design & Branding",
    summary: "Brand identities, logos, social media and print design, and motion graphics.",
    offerings: ["Brand identity", "Logo design", "Social media design", "Flyers and posters", "Motion graphics"],
    delivery: {
      kind: "collaboration",
      partner: collaborator.name,
      note: `May be provided in collaboration with ${collaborator.name}, ${collaborator.description}. Scope and terms for this work are confirmed with them before it is quoted.`,
    },
    detailHref: "/services#services",
  },
];

export function serviceCategoryById(id: string): ServiceCategory | undefined {
  return serviceCategories.find((category) => category.id === id);
}

/** The enquiry form's extra choice for visitors who are not sure yet. */
export const unsureServiceOption = { id: "not-sure", title: "Not sure yet" } as const;
