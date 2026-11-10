"use server";

import { headers } from "next/headers";
import {
  elapsedField,
  honeypotField,
  minimumFillMs,
  readEnquiry,
  SUBMISSION_ID,
  submissionField,
  validateEnquiry,
  type EnquiryResult,
} from "@/lib/enquiry";
import { emailConfig, sendEnquiryEmail } from "@/lib/enquiry-email";

/**
 * Receives a project enquiry. Spam checks and validation run here (the
 * browser's checks can be bypassed); then the enquiry is emailed to the
 * agency inbox (enquiry-email.ts). The visitor is told exactly what
 * happened: "sent" only once the email provider has accepted it.
 */
export async function submitEnquiry(_previous: EnquiryResult, formData: FormData): Promise<EnquiryResult> {
  if (looksAutomated(formData)) return { status: "rejected" };
  if (await rateLimited()) return { status: "rate-limited" };

  const values = readEnquiry(formData);
  const errors = validateEnquiry(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  const config = emailConfig();
  if (!config) return { status: "not-configured" };

  const submitted = String(formData.get(submissionField) ?? "");
  const idempotencyKey = `enquiry-${SUBMISSION_ID.test(submitted) ? submitted : crypto.randomUUID()}`;
  try {
    await sendEnquiryEmail(config, values, idempotencyKey);
    return { status: "sent" };
  } catch (error) {
    /* Details stay in the server log; the visitor sees a retry message. */
    console.error("[enquiry] delivery failed:", error instanceof Error ? error.message : "unknown error");
    return { status: "failed" };
  }
}

/* A hidden field was filled in, or the form was sent faster than a person
   could fill it in (or without the timing the form always sends). */
function looksAutomated(formData: FormData): boolean {
  if (String(formData.get(honeypotField) ?? "").trim() !== "") return true;
  const elapsed = Number(formData.get(elapsedField));
  return !Number.isFinite(elapsed) || elapsed < minimumFillMs;
}

/*
 * At most RATE_MAX enquiries per address per window. Kept in this server
 * instance's memory, so it resets on restart and is per instance; a
 * shared store (or the delivery provider's own limits) should replace it
 * once enquiries are delivered from more than one server.
 */
const RATE_MAX = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map<string, number[]>();

async function rateLimited(): Promise<boolean> {
  const list = await headers();
  const address = list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
  const now = Date.now();
  const recent = (attempts.get(address) ?? []).filter((at) => now - at < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    attempts.set(address, recent);
    return true;
  }
  recent.push(now);
  attempts.set(address, recent);
  if (attempts.size > 5000) {
    for (const [key, times] of attempts) if (times.every((at) => now - at >= RATE_WINDOW_MS)) attempts.delete(key);
  }
  return false;
}
