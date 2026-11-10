import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { EnquiryForm } from "@/components/contact/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Share a little about your project, and let’s explore how we can help.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <EnquiryForm />
    </>
  );
}
