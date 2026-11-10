/**
 * Project enquiry: fields and validation shared by the form (instant
 * feedback) and the server action (the check that counts).
 *
 * The form asks only for what a first conversation needs. It never asks
 * for passwords, credentials or confidential records.
 */
import { serviceCategories, unsureServiceOption } from "@/data/service-categories";

export const enquiryLimits = {
  name: 120,
  email: 254,
  organisation: 160,
  message: 5000,
  messageMin: 20,
  existingUrl: 300,
  budget: 120,
  phone: 30,
} as const;

export const timelineOptions = [
  { id: "asap", label: "As soon as possible" },
  { id: "1-3-months", label: "Within 1–3 months" },
  { id: "3-6-months", label: "In 3–6 months" },
  { id: "6-plus-months", label: "More than 6 months away" },
  { id: "flexible", label: "Flexible or not sure yet" },
] as const;

export const supportOptions = [
  { id: "hosting-and-maintenance", label: "Hosting and maintenance" },
  { id: "maintenance", label: "Maintenance only" },
  { id: "hosting", label: "Hosting only" },
  { id: "none", label: "No, we’ll handle it ourselves" },
  { id: "not-sure", label: "Not sure yet" },
] as const;

export const contactMethodOptions = [
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone call" },
  { id: "whatsapp", label: "WhatsApp" },
] as const;

export const serviceOptions = [
  ...serviceCategories.map((category) => ({ id: category.id, title: category.title })),
  unsureServiceOption,
];

export type EnquiryValues = {
  name: string;
  email: string;
  organisation: string;
  services: string[];
  message: string;
  existingUrl: string;
  budget: string;
  timeline: string;
  support: string;
  contactMethod: string;
  phone: string;
  consent: boolean;
};

export type EnquiryField = keyof EnquiryValues;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

/** Field order on the page: errors are summarised and focused in this order. */
export const enquiryFieldOrder: EnquiryField[] = [
  "name",
  "email",
  "organisation",
  "services",
  "message",
  "existingUrl",
  "budget",
  "timeline",
  "support",
  "contactMethod",
  "phone",
  "consent",
];

export type EnquiryResult =
  | { status: "idle" }
  | { status: "invalid"; errors: EnquiryErrors }
  /** Delivery is not set up: nothing was sent. */
  | { status: "not-configured" }
  | { status: "failed" }
  /** Looked automated (spam checks); nothing was sent. */
  | { status: "rejected" }
  /** Too many attempts from one place in a short time. */
  | { status: "rate-limited" }
  /** Only after the delivery service confirmed receipt. */
  | { status: "sent" };

export const emptyEnquiry: EnquiryValues = {
  name: "",
  email: "",
  organisation: "",
  services: [],
  message: "",
  existingUrl: "",
  budget: "",
  timeline: "",
  support: "",
  contactMethod: "",
  phone: "",
  consent: false,
};

const serviceIds = new Set(serviceOptions.map((option) => option.id));
const timelineIds = new Set<string>(timelineOptions.map((option) => option.id));
const supportIds = new Set<string>(supportOptions.map((option) => option.id));
const contactIds = new Set<string>(contactMethodOptions.map((option) => option.id));
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9 ()-]{7,}$/;

/** "example.com" or "https://example.com/app" — a web address, with or without https://. */
function isWebAddress(value: string): boolean {
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    return (url.protocol === "https:" || url.protocol === "http:") && /\.[a-z]{2,}$/i.test(url.hostname);
  } catch {
    return false;
  }
}

const tooLong = (max: number) => `Use ${max} characters or fewer.`;

export function validateEnquiry(values: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();
  const existingUrl = values.existingUrl.trim();
  const phone = values.phone.trim();

  if (!name) errors.name = "Enter your name.";
  else if (name.length > enquiryLimits.name) errors.name = tooLong(enquiryLimits.name);

  if (!email) errors.email = "Enter your email address.";
  else if (email.length > enquiryLimits.email || !EMAIL.test(email))
    errors.email = "Enter an email address in the format name@example.com.";

  if (values.organisation.trim().length > enquiryLimits.organisation) errors.organisation = tooLong(enquiryLimits.organisation);

  if (values.services.length === 0) errors.services = "Choose at least one service, or “Not sure yet”.";
  else if (values.services.some((id) => !serviceIds.has(id))) errors.services = "Choose services from the list.";

  if (!message) errors.message = "Tell us a little about your project.";
  else if (message.length < enquiryLimits.messageMin)
    errors.message = `Add a little more detail (at least ${enquiryLimits.messageMin} characters).`;
  else if (message.length > enquiryLimits.message) errors.message = tooLong(enquiryLimits.message);

  if (existingUrl.length > enquiryLimits.existingUrl) errors.existingUrl = tooLong(enquiryLimits.existingUrl);
  else if (existingUrl && !isWebAddress(existingUrl)) errors.existingUrl = "Enter a web address, such as example.com.";

  if (values.budget.trim().length > enquiryLimits.budget) errors.budget = tooLong(enquiryLimits.budget);

  if (!values.timeline) errors.timeline = "Choose a timeline, or “Flexible or not sure yet”.";
  else if (!timelineIds.has(values.timeline)) errors.timeline = "Choose a timeline from the list.";

  if (!values.support) errors.support = "Choose an option, or “Not sure yet”.";
  else if (!supportIds.has(values.support)) errors.support = "Choose an option from the list.";

  if (!values.contactMethod) errors.contactMethod = "Choose how you’d like us to contact you.";
  else if (!contactIds.has(values.contactMethod)) errors.contactMethod = "Choose an option from the list.";

  const needsPhone = values.contactMethod === "phone" || values.contactMethod === "whatsapp";
  if (needsPhone && !phone) errors.phone = "Enter a phone number so we can reach you.";
  else if (phone.length > enquiryLimits.phone || (phone && !PHONE.test(phone)))
    errors.phone = "Enter a phone number using digits, spaces and an optional + country code.";

  if (!values.consent) errors.consent = "Confirm that we may use these details to respond.";

  return errors;
}

/* Control characters (other than tab and line breaks) are dropped. */
const clean = (value: string) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

export function readEnquiry(formData: FormData): EnquiryValues {
  const text = (key: string) => clean(String(formData.get(key) ?? ""));
  return {
    name: text("name"),
    email: text("email"),
    organisation: text("organisation"),
    services: formData.getAll("services").map(String),
    message: text("message"),
    existingUrl: text("existingUrl"),
    budget: text("budget"),
    timeline: text("timeline"),
    support: text("support"),
    contactMethod: text("contactMethod"),
    phone: text("phone"),
    consent: formData.get("consent") === "yes",
  };
}

/* ---- Spam protection (checked on the server) ---- */

/** A field people never see or fill in; automated submissions often do. */
export const honeypotField = "website_url";
/** Milliseconds from the form appearing to it being sent. */
export const elapsedField = "elapsed_ms";
/** Faster than a person can fill in the form. */
export const minimumFillMs = 3000;

/** One id per filled-in form: repeated sends of it are delivered once. */
export const submissionField = "submission_id";
export const SUBMISSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
