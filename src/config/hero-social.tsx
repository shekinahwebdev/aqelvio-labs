import type { SVGProps } from "react";
import { site } from "@/config/site";

type SocialIconProps = SVGProps<SVGSVGElement>;

/* One family: solid glyphs on a 24px grid, optically matched in weight. */

function InstagramIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2.1A3.4 3.4 0 0 0 4.1 7.5v9a3.4 3.4 0 0 0 3.4 3.4h9a3.4 3.4 0 0 0 3.4-3.4v-9a3.4 3.4 0 0 0-3.4-3.4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.1a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z"
      />
      <circle cx="17.4" cy="6.6" r="1.25" />
    </svg>
  );
}

/* TikTok note glyph (Simple Icons, CC0). */
function TikTokIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
    </svg>
  );
}

/* X (formerly Twitter) logo (Simple Icons, CC0). */
function XIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

export const heroSocialPlatforms = [
  { id: "instagram", label: "Instagram", icon: InstagramIcon },
  { id: "tiktok", label: "TikTok", icon: TikTokIcon },
  { id: "x", label: "X (Twitter)", icon: XIcon },
] as const;

export type HeroSocialDisplayItem = {
  id: (typeof heroSocialPlatforms)[number]["id"];
  label: string;
  icon: (typeof heroSocialPlatforms)[number]["icon"];
  href: string | null;
};

/** Visual rail always lists platforms; href is null until configured in site.social. */
export function getHeroSocialDisplay(): HeroSocialDisplayItem[] {
  return heroSocialPlatforms.map((platform) => ({
    ...platform,
    href: site.social[platform.id] ?? null,
  }));
}
