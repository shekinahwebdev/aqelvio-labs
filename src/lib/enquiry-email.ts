import "server-only";

import {
  contactMethodOptions,
  serviceOptions,
  supportOptions,
  timelineOptions,
  type EnquiryValues,
} from "@/lib/enquiry";

/*
 * Enquiry notifications, sent through Resend's REST API
 * (https://resend.com/docs/api-reference/emails/send-email).
 *
 * Configuration (server-side environment variables only; see .env.example):
 *   RESEND_API_KEY       API key from the Resend account.
 *   ENQUIRY_TO_EMAIL     Inbox that receives enquiries.
 *   ENQUIRY_FROM_EMAIL   Sender. Until the agency domain is verified in
 *                        Resend this must be "…<onboarding@resend.dev>",
 *                        which Resend only delivers to the email address
 *                        the Resend account is registered with.
 *
 * The visitor's validated address is the Reply-To, never the From.
 */

export type EmailConfig = { apiKey: string; to: string; from: string };

const DEFAULT_FROM = "Aqelvio Labs Enquiries <onboarding@resend.dev>";

/** null when delivery is not configured. */
export function emailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ENQUIRY_TO_EMAIL?.trim();
  const from = process.env.ENQUIRY_FROM_EMAIL?.trim() || DEFAULT_FROM;
  if (!apiKey || !to) return null;
  return { apiKey, to, from };
}

const label = (options: readonly { id: string; label?: string; title?: string }[], id: string) => {
  const option = options.find((item) => item.id === id);
  return option?.label ?? option?.title ?? id;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/* Header values must stay on one line. */
const oneLine = (value: string) => value.replace(/[\r\n\t]+/g, " ").trim();

function rows(enquiry: EnquiryValues): [string, string][] {
  const phoneNeeded = enquiry.contactMethod === "phone" || enquiry.contactMethod === "whatsapp";
  return [
    ["Name", enquiry.name.trim()],
    ["Email", enquiry.email.trim()],
    ["Company or organisation", enquiry.organisation.trim() || "Not given"],
    ["Services", enquiry.services.map((id) => label(serviceOptions, id)).join(", ")],
    ["Existing website or application", enquiry.existingUrl.trim() || "Not given"],
    ["Estimated budget", enquiry.budget.trim() || "Not given"],
    ["Desired timeline", label(timelineOptions, enquiry.timeline)],
    ["Ongoing hosting or maintenance", label(supportOptions, enquiry.support)],
    ["Preferred contact method", label(contactMethodOptions, enquiry.contactMethod)],
    ...(phoneNeeded || enquiry.phone.trim() ? ([["Phone", enquiry.phone.trim() || "Not given"]] as [string, string][]) : []),
    ["Consent to be contacted", enquiry.consent ? "Yes" : "No"],
  ];
}

export function buildEnquiryEmail(enquiry: EnquiryValues, receivedAt: Date) {
  const name = oneLine(enquiry.name).slice(0, 80);
  const organisation = oneLine(enquiry.organisation).slice(0, 80);
  const subject = `New enquiry: ${name}${organisation ? ` (${organisation})` : ""}`;
  const message = enquiry.message.trim();
  const when = receivedAt.toUTCString();
  const fields = rows(enquiry);

  const text = [
    "New project enquiry from the Aqelvio Labs website.",
    "",
    ...fields.map(([key, value]) => `${key}: ${value}`),
    "",
    "Project description:",
    message,
    "",
    `Received: ${when}`,
    "Reply to this email to respond to the sender.",
  ].join("\n");

  const cell = "padding:8px 12px;border-bottom:1px solid #e5e5e5;vertical-align:top;font-size:14px;line-height:1.5";
  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#111">
<table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#fff;border-radius:8px;border-collapse:collapse">
<tr><td colspan="2" style="padding:20px 12px 8px;font-size:18px;font-weight:bold">New project enquiry</td></tr>
<tr><td colspan="2" style="padding:0 12px 16px;font-size:13px;color:#666">From the Aqelvio Labs website · ${escapeHtml(when)}</td></tr>
${fields
  .map(
    ([key, value]) =>
      `<tr><th align="left" style="${cell};width:38%;color:#555;font-weight:normal">${escapeHtml(key)}</th><td style="${cell}">${escapeHtml(value)}</td></tr>`,
  )
  .join("\n")}
<tr><th align="left" colspan="2" style="padding:16px 12px 4px;font-size:14px;color:#555;font-weight:normal">Project description</th></tr>
<tr><td colspan="2" style="padding:0 12px 20px;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</td></tr>
<tr><td colspan="2" style="padding:12px;font-size:12px;color:#888;border-top:1px solid #e5e5e5">Reply to this email to respond to ${escapeHtml(name)}.</td></tr>
</table>
</body></html>`;

  return { subject, text, html, replyTo: oneLine(enquiry.email) };
}

export class DeliveryError extends Error {}

/**
 * Hands the enquiry to Resend. Resolves only once Resend has accepted it
 * (2xx with an id); throws DeliveryError otherwise. `idempotencyKey` makes
 * a repeated send of the same submission a no-op on Resend's side.
 */
export async function sendEnquiryEmail(
  config: EmailConfig,
  enquiry: EnquiryValues,
  idempotencyKey: string,
): Promise<{ id: string }> {
  const email = buildEnquiryEmail(enquiry, new Date());
  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: email.replyTo,
        subject: email.subject,
        text: email.text,
        html: email.html,
        tags: [{ name: "category", value: "website_enquiry" }],
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
  } catch (error) {
    throw new DeliveryError(`Resend request failed: ${error instanceof Error ? error.name : "unknown"}`);
  }

  const body = (await response.json().catch(() => null)) as { id?: string; name?: string; message?: string } | null;
  if (!response.ok || !body?.id) {
    /* Logged on the server only; never shown to visitors. */
    throw new DeliveryError(`Resend rejected the enquiry: ${response.status} ${body?.name ?? ""} ${body?.message ?? ""}`.trim());
  }
  return { id: body.id };
}
