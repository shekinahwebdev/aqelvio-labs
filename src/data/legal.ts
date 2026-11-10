import { site } from "@/config/site";

export const legalMeta = {
  title: "Legal & copyright",
  description:
    "Copyright, intellectual property, and acceptable use for the Aqelvio Labs website and codebase.",
  updated: "2026-11-10",
} as const;

export const copyrightHolder = "Patricia Shiloh Kanneh";

export type LegalSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export const legalSections: LegalSection[] = [
  {
    id: "ownership",
    heading: "Ownership",
    paragraphs: [
      `Unless stated otherwise, all content on ${site.name}—including the site design, layout, source code, written copy, logos, animations, and curated media presentations—is owned by ${copyrightHolder} and/or ${site.legalName} and is protected by copyright and related laws.`,
      "Client work shown in our portfolio remains the property of the respective clients or as agreed in project contracts. We display it only with permission and for illustration of our capabilities.",
    ],
  },
  {
    id: "your-rights",
    heading: "What you may do",
    paragraphs: [
      "You may browse this website, share links to our pages, and contact us through the enquiry form for legitimate business purposes.",
      "You may fork or download this repository only for private study. Any public reuse, republication, or commercial use requires our written consent.",
    ],
  },
  {
    id: "prohibited",
    heading: "What is not allowed",
    paragraphs: [
      "Without our prior written permission, you may not:",
    ],
    bullets: [
      "Copy, clone, or republish this site (or a substantial part of it) on another domain or template marketplace.",
      "Use our code, design, or branding to imply partnership, endorsement, or that the work is your own.",
      "Scrape or bulk-download content, assets, or source for redistribution or AI training.",
      "Reverse-engineer or remove technical measures intended to protect our work.",
      "Register or use trademarks, names, or trade dress confusingly similar to Aqelvio Labs.",
    ],
  },
  {
    id: "third-party",
    heading: "Third-party content",
    paragraphs: [
      "Some photography and open-source libraries used on this site are licensed separately. Credits appear in the codebase or on the site where required. Those third-party licenses do not grant rights to our original design, code structure, or brand assets.",
    ],
  },
  {
    id: "enforcement",
    heading: "Reporting misuse",
    paragraphs: [
      `If you believe someone is copying or misusing ${site.name} assets or code, please reach out via our contact page with the URL or repository in question. We review reports and may pursue remedies available under applicable intellectual property and unfair-competition law.`,
      "This page is a plain-language summary of our position. It is not legal advice. For formal licensing, white-label use, or partnership, contact us before using our materials.",
    ],
  },
  {
    id: "changes",
    heading: "Updates",
    paragraphs: [
      `We may update these terms from time to time. The "Last updated" date at the top of this page reflects the latest revision. Continued use of the site after changes constitutes acceptance of the updated terms.`,
    ],
  },
];
