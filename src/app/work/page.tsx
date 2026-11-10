import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { WorkPortfolio } from "@/components/work/WorkPortfolio";

export const metadata: Metadata = {
  title: "Work",
  description: "Explore our work across brands, digital experiences, and motion.",
};

const HEADING = "Selected Works";
const PILL = ["Design", "Digital", "Motion"];

/*
 * Compact introduction, after the reference (Origin Studio works-03): a
 * narrow pill with a slowly drifting label above a light, centred heading,
 * then the first project directly beneath. The heading's letters un-blur
 * in on load (the reference's entrance), in CSS so nothing waits on JS;
 * with reduced motion the text is simply there and the pill is still.
 */
export default function WorkPage() {
  return (
    <>
      <section aria-labelledby="work-heading" className="wki">
        <p className="wki-pill">
          <span className="sr-only">{PILL.join(", ")}</span>
          <span className="wki-track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <span key={copy} className="wki-copy">
                {PILL.map((word) => (
                  <span key={word} className="wki-word">
                    {word}
                    <span className="wki-dot">•</span>
                  </span>
                ))}
              </span>
            ))}
          </span>
        </p>
        <h1 id="work-heading" className="wki-heading">
          <span className="sr-only">{HEADING}</span>
          <span aria-hidden="true">
            {HEADING.split(" ").map((word, w, words) => {
              /* Running letter index across words, for the stagger. */
              const offset = words.slice(0, w).join("").length;
              return (
                <span key={w}>
                  {w ? " " : null}
                  <span className="wki-word-group">
                    {[...word].map((char, c) => (
                      <span key={c} className="wki-char" style={{ "--i": offset + c } as CSSProperties}>
                        {char}
                      </span>
                    ))}
                  </span>
                </span>
              );
            })}
          </span>
        </h1>
      </section>
      <WorkPortfolio />
      <p className="pricing-pointer wk-pricing">
        Planning something similar? <Link href="/pricing">See how we scope and price projects</Link>.
      </p>
    </>
  );
}
