import type { Metadata } from "next";
import { LegalView } from "@/components/legal/LegalView";
import { legalMeta } from "@/data/legal";

export const metadata: Metadata = {
  title: legalMeta.title,
  description: legalMeta.description,
  robots: {
    index: true,
    follow: true,
  },
};

export default function LegalPage() {
  return <LegalView />;
}
