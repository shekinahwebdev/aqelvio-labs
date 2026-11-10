import type { Metadata } from "next";
import { ServicesIntro } from "@/components/services/ServicesIntro";
import { ServiceCategories } from "@/components/services/ServiceCategories";
import { ServicePanels } from "@/components/services/ServicePanels";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website development, custom software, mobile applications, AI solutions and automation, backend and cloud engineering, and design services including branding and motion graphics.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesIntro />
      <ServiceCategories />
      <ServicePanels />
    </>
  );
}
