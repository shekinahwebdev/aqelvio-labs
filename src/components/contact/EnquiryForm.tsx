"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { submitEnquiry } from "@/app/contact/actions";
import { contactEnquiryId } from "@/config/navigation";
import {
  contactMethodOptions,
  elapsedField,
  emptyEnquiry,
  enquiryFieldOrder,
  enquiryLimits,
  honeypotField,
  serviceOptions,
  submissionField,
  supportOptions,
  timelineOptions,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryField,
  type EnquiryResult,
  type EnquiryValues,
} from "@/lib/enquiry";

/*
 * Project enquiry form. Inputs are controlled, so whatever the visitor typed
 * stays put if sending fails; the form is cleared only after a confirmed
 * delivery. Errors appear on submit (then update as fields are corrected),
 * focus moves to the first problem, and the outcome is announced.
 *
 * Spam protection: a hidden field people never fill in, and the time taken
 * to fill the form, both checked on the server (with a rate limit).
 */
export function EnquiryForm() {
  const [values, setValues] = useState<EnquiryValues>(emptyEnquiry);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [checked, setChecked] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const shownAt = useRef(0);
  /* Identifies this filled-in form, so a repeated send is delivered once. */
  const submissionId = useRef("");

  useEffect(() => {
    shownAt.current = performance.now();
    submissionId.current = crypto.randomUUID();
  }, []);

  /* The server's answer is applied here, as part of the same transition:
     its validation errors replace ours; the form clears only once the
     enquiry was confirmed sent. Anything else keeps every value. */
  const [result, action, pending] = useActionState<EnquiryResult, FormData>(async (previous, data) => {
    const next = await submitEnquiry(previous, data);
    if (next.status === "invalid") setErrors(next.errors);
    if (next.status === "sent") {
      setValues(emptyEnquiry);
      setChecked(false);
    }
    /* After a send (or a failed attempt) the next one is a new request; a
       retry reusing the old id with a new timestamp would be refused. */
    if (next.status === "sent" || next.status === "failed") submissionId.current = crypto.randomUUID();
    return next;
  }, { status: "idle" });

  /* After each answer, move focus to it (or to the first problem). */
  useEffect(() => {
    if (result.status === "idle") return;
    if (result.status === "invalid") focusFirst(formRef.current, result.errors);
    else statusRef.current?.focus();
  }, [result]);

  const update = <K extends keyof EnquiryValues>(key: K, value: EnquiryValues[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (checked) setErrors(validateEnquiry(next));
  };

  const toggleService = (id: string) =>
    update("services", values.services.includes(id) ? values.services.filter((s) => s !== id) : [...values.services, id]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    setChecked(true);
    const found = validateEnquiry(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirst(formRef.current, found);
      return;
    }
    const data = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (key === "services") values.services.forEach((id) => data.append("services", id));
      else if (key === "consent") data.set("consent", values.consent ? "yes" : "");
      else data.set(key, String(value));
    }
    data.set(honeypotField, honeypot);
    data.set(elapsedField, String(Math.round(performance.now() - shownAt.current)));
    data.set(submissionField, submissionId.current);
    startTransition(() => action(data));
  };

  const errorCount = Object.keys(errors).length;
  const describe = (key: EnquiryField, hint?: string) =>
    [hint, errors[key] ? `${key}-error` : null].filter(Boolean).join(" ") || undefined;
  const needsPhone = values.contactMethod === "phone" || values.contactMethod === "whatsapp";

  return (
    <section id={contactEnquiryId} aria-labelledby="enquiry-heading" className="eq">
      <div className="eq-inner">
        <div className="eq-intro">
          <h2 id="enquiry-heading" className="eq-heading" tabIndex={-1} data-enquiry-focus>
            Tell us what you have in mind.
          </h2>
          <p className="eq-lede">Share a little about your project, and let’s explore how we can help.</p>
          <p className="pricing-pointer eq-pointer">
            Wondering how quotes, hosting and maintenance work? <Link href="/pricing">See pricing and engagements</Link>.
          </p>
        </div>

        <form ref={formRef} className="eq-form" noValidate onSubmit={onSubmit} aria-describedby="eq-required">
          <p id="eq-required" className="eq-note">
            All fields are required unless marked optional.
          </p>

          {checked && errorCount > 0 ? (
            <p className="eq-summary" role="alert">
              {errorCount === 1 ? "There is 1 problem" : `There are ${errorCount} problems`} with the form. Please check the
              highlighted {errorCount === 1 ? "field" : "fields"}.
            </p>
          ) : null}

          {/* Spam trap: hidden from people and assistive technology. */}
          <div className="eq-trap" aria-hidden="true">
            <label htmlFor={honeypotField}>Leave this field empty</label>
            <input
              id={honeypotField}
              name={honeypotField}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="eq-row">
            <Field id="name" label="Full name" error={errors.name}>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={enquiryLimits.name}
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={describe("name")}
                className="eq-input"
              />
            </Field>
            <Field id="email" label="Email address" error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                maxLength={enquiryLimits.email}
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describe("email")}
                className="eq-input"
              />
            </Field>
          </div>

          <Field id="organisation" label="Company or organisation" optional error={errors.organisation}>
            <input
              id="organisation"
              name="organisation"
              type="text"
              autoComplete="organization"
              maxLength={enquiryLimits.organisation}
              value={values.organisation}
              onChange={(e) => update("organisation", e.target.value)}
              aria-invalid={errors.organisation ? true : undefined}
              aria-describedby={describe("organisation")}
              className="eq-input"
            />
          </Field>

          <Choices
            name="services"
            legend="Service required"
            hint="Choose all that apply."
            type="checkbox"
            options={serviceOptions.map((option) => ({ id: option.id, label: option.title }))}
            isChecked={(id) => values.services.includes(id)}
            onToggle={toggleService}
            error={errors.services}
          />

          <Field
            id="message"
            label="Project description"
            error={errors.message}
            hint="What you need, your goals, and any references. Please don’t include passwords, access details or confidential records."
          >
            <textarea
              id="message"
              name="message"
              rows={6}
              maxLength={enquiryLimits.message}
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describe("message", "message-hint")}
              className="eq-input eq-textarea"
            />
          </Field>

          <div className="eq-row">
            <Field id="existingUrl" label="Existing website or application" optional error={errors.existingUrl}>
              <input
                id="existingUrl"
                name="existingUrl"
                type="text"
                inputMode="url"
                autoComplete="url"
                spellCheck={false}
                placeholder="example.com"
                maxLength={enquiryLimits.existingUrl}
                value={values.existingUrl}
                onChange={(e) => update("existingUrl", e.target.value)}
                aria-invalid={errors.existingUrl ? true : undefined}
                aria-describedby={describe("existingUrl")}
                className="eq-input"
              />
            </Field>
            <Field id="budget" label="Estimated budget range" optional error={errors.budget} hint="A rough range in any currency helps us suggest a suitable scope.">
              <input
                id="budget"
                name="budget"
                type="text"
                maxLength={enquiryLimits.budget}
                value={values.budget}
                onChange={(e) => update("budget", e.target.value)}
                aria-invalid={errors.budget ? true : undefined}
                aria-describedby={describe("budget", "budget-hint")}
                className="eq-input"
              />
            </Field>
          </div>

          <Field id="timeline" label="Desired timeline" error={errors.timeline}>
            <select
              id="timeline"
              name="timeline"
              value={values.timeline}
              onChange={(e) => update("timeline", e.target.value)}
              aria-invalid={errors.timeline ? true : undefined}
              aria-describedby={describe("timeline")}
              className="eq-input eq-select"
            >
              <option value="" disabled>
                Choose a timeline
              </option>
              {timelineOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Choices
            name="support"
            legend="Will you need ongoing hosting or maintenance?"
            type="radio"
            options={supportOptions.map((option) => ({ id: option.id, label: option.label }))}
            isChecked={(id) => values.support === id}
            onToggle={(id) => update("support", id)}
            error={errors.support}
          />

          <Choices
            name="contactMethod"
            legend="Preferred contact method"
            type="radio"
            options={contactMethodOptions.map((option) => ({ id: option.id, label: option.label }))}
            isChecked={(id) => values.contactMethod === id}
            onToggle={(id) => update("contactMethod", id)}
            error={errors.contactMethod}
          />

          {needsPhone ? (
            <Field id="phone" label="Phone number" error={errors.phone} hint="Include your country code, for example +233.">
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={enquiryLimits.phone}
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={describe("phone", "phone-hint")}
                className="eq-input eq-input-short"
              />
            </Field>
          ) : null}

          <div className="eq-privacy">
            <p id="privacy-note" className="eq-hint">
              We use the details you send only to respond to your enquiry and prepare a proposal. We don’t ask for
              passwords, access credentials or confidential business records, so please leave them out.
            </p>
            <label className="eq-consent">
              <input
                type="checkbox"
                name="consent"
                checked={values.consent}
                onChange={(e) => update("consent", e.target.checked)}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={["privacy-note", errors.consent ? "consent-error" : null].filter(Boolean).join(" ")}
                className="eq-check"
              />
              <span>I agree to Aqelvio Labs using these details to respond to my enquiry.</span>
            </label>
            {errors.consent ? (
              <p id="consent-error" className="eq-error">
                {errors.consent}
              </p>
            ) : null}
          </div>

          <div className="eq-submit-row">
            <button type="submit" className="eq-submit" aria-disabled={pending || undefined} disabled={pending}>
              {pending ? "Sending…" : "Send enquiry"}
            </button>
            <div ref={statusRef} tabIndex={-1} className="eq-status-wrap" aria-live="polite">
              {pending ? <p className="eq-status">Sending your enquiry…</p> : null}
              {!pending && result.status === "sent" ? (
                <p className="eq-status eq-status-ok" role="status">
                  Thank you for contacting Aqelvio Labs. Your enquiry has been submitted. We’ll review it and get back to
                  you using the email address you provided.
                </p>
              ) : null}
              {!pending && result.status === "not-configured" ? (
                <p className="eq-status eq-status-warn" role="alert">
                  Online enquiries aren’t connected yet, so this message has not been sent. Your details are still in the
                  form.
                </p>
              ) : null}
              {!pending && result.status === "failed" ? (
                <p className="eq-status eq-status-warn" role="alert">
                  We couldn’t submit your enquiry just now. Your details are still in the form, so please try again in
                  a moment.
                </p>
              ) : null}
              {!pending && result.status === "rejected" ? (
                <p className="eq-status eq-status-warn" role="alert">
                  We couldn’t accept this submission. Please wait a moment and send it again.
                </p>
              ) : null}
              {!pending && result.status === "rate-limited" ? (
                <p className="eq-status eq-status-warn" role="alert">
                  Too many enquiries have been sent from here recently. Please try again in a few minutes.
                </p>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function focusFirst(form: HTMLFormElement | null, found: EnquiryErrors) {
  const first = enquiryFieldOrder.find((key) => found[key]);
  if (!first || !form) return;
  form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
}

function Field({
  id,
  label,
  optional,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="eq-field">
      <label htmlFor={id} className="eq-label">
        {label}
        {optional ? <span className="eq-optional"> (optional)</span> : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="eq-hint">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="eq-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* A group of checkbox or radio chips with a legend, hint and error. */
function Choices({
  name,
  legend,
  hint,
  type,
  options,
  isChecked,
  onToggle,
  error,
}: {
  name: EnquiryField;
  legend: string;
  hint?: string;
  type: "checkbox" | "radio";
  options: { id: string; label: string }[];
  isChecked: (id: string) => boolean;
  onToggle: (id: string) => void;
  error?: string;
}) {
  const described = [hint ? `${name}-hint` : null, error ? `${name}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <fieldset className="eq-field eq-services" aria-invalid={error ? true : undefined} aria-describedby={described}>
      <legend className="eq-label">{legend}</legend>
      {hint ? (
        <p id={`${name}-hint`} className="eq-hint">
          {hint}
        </p>
      ) : null}
      <div className="eq-chips">
        {options.map((option) => (
          <label key={option.id} className="eq-chip">
            <input
              type={type}
              name={name}
              value={option.id}
              checked={isChecked(option.id)}
              onChange={() => onToggle(option.id)}
              className="eq-check"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={`${name}-error`} className="eq-error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
