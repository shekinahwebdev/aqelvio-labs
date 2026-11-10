import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { CtaWall } from "@/components/layout/CtaWall";
import { Header } from "@/components/layout/Header";
import { InPageLinks } from "@/components/layout/InPageLinks";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { MediaGuard } from "@/components/media/MediaGuard";
import { site } from "@/config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.defaultTitle,
    template: site.seo.titleTemplate,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.seo.defaultTitle,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.defaultTitle,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <InPageLinks />
        <MediaGuard />
        <Suspense fallback={<HeaderFallback />}>
          <Header />
        </Suspense>
        {/* Every public page: its content, then the shared contact call to
            action (part of the main content), then the footer. */}
        <main id="main-content" className="flex-1">
          {children}
          <CtaWall />
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

function HeaderFallback() {
  return <div className="h-[var(--header-height)]" aria-hidden="true" />;
}
