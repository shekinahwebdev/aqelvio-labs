import { Hero } from "@/components/home/Hero";
import { HomeServicesIntro } from "@/components/home/HomeServicesIntro";
import { CollaborationReveal } from "@/components/home/CollaborationReveal";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { RecentProjects } from "@/components/home/RecentProjects";
import Link from "next/link";
import { Faqs } from "@/components/home/Faqs";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeServicesIntro />
      <CollaborationReveal />
      <ServicesShowcase />
      <WhatWeDo />
      <RecentProjects />
      <Faqs>
        <p className="pricing-pointer faq-pointer">
          Questions about cost, hosting or maintenance? <Link href="/pricing">See pricing and engagements</Link>.
        </p>
      </Faqs>
    </>
  );
}
