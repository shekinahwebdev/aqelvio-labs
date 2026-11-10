import { site } from "@/config/site";

/**
 * Homepage collaboration statement (CollaborationReveal). Edit the strings
 * here to change brand spelling; the section sizes itself to fit them.
 */
export const collaboration = {
  lead: site.name,
  connector: "in collaboration with",
  /* Confirmed spelling (matches site.collaborators.achevaGraphix). */
  partner: site.collaborators.achevaGraphix.name,
  /**
   * Image shown through the lettering. Original Aqelvio artwork
   * (long-exposure light trails in the brand orange), kept bright across the
   * frame so every letter reads against the near-black section.
   * `srcSmall` serves screens up to 767px wide.
   */
  image: {
    src: "/images/home/collaboration-light.jpg",
    srcSmall: "/images/home/collaboration-light-1280.jpg",
  },
} as const;
