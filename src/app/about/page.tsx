import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aqelvio Labs brings software and digital experiences together with creative work from Acheva Graphix.",
};

export default function AboutPage() {
  return <AboutView />;
}
