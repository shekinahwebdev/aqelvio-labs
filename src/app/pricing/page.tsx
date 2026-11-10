import type { Metadata } from "next";
import { PricingView } from "@/components/pricing/PricingView";

export const metadata: Metadata = {
  title: "Pricing & Engagement",
  description:
    "How Aqelvio Labs quotes custom projects, and how development, hosting, domains and maintenance are arranged and billed.",
};

export default function PricingPage() {
  return <PricingView />;
}
