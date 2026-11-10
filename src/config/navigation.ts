export const navigation = [
  { number: "01", label: "Home", href: "/" },
  { number: "02", label: "Services", href: "/services" },
  { number: "03", label: "Pricing", href: "/pricing" },
  { number: "04", label: "Work", href: "/work" },
  { number: "05", label: "About", href: "/about" },
  { number: "06", label: "Contact", href: "/contact" },
] as const;

export const primaryCta = {
  label: "Start a Project",
  href: "/contact",
} as const;

/**
 * The contact page's enquiry content. On /contact the shared call to
 * action scrolls here instead of linking to the page it is already on;
 * the enquiry form should keep this id when it is built.
 */
export const contactEnquiryId = "enquiry";

export const secondaryCta = {
  label: "Explore Our Work",
  href: "/work",
} as const;

export type NavItem = (typeof navigation)[number];
