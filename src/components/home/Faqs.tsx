"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { faqIntro, faqs, type Faq } from "@/data/home-closing";

/*
 * FAQs: one answer open at a time. Each question is a real <button> with
 * aria-expanded, controlling a labelled region. The answer's height eases
 * open and shut in CSS (grid rows 0fr ↔ 1fr, as the reference's 0.5s
 * height tween); collapsed answers are visibility: hidden, so they are not
 * read, found or focused. Reduced motion: no transition (globals.css).
 *
 * Opening or closing changes the page height, so once it settles the
 * scroll-driven sections below (the image wall) re-measure. Lenis follows
 * on its own (it observes <body>).
 */
const SETTLE_MS = 520;

type FaqsProps = {
  /** Section id (an in-page target); also prefixes the question ids. */
  id?: string;
  heading?: string;
  intro?: string;
  items?: readonly Faq[];
  /** Shown below the questions (e.g. a related link). */
  children?: ReactNode;
};

/* The homepage FAQs by default; other pages pass their own questions. */
export function Faqs({ id: sectionId = "faqs", heading = faqIntro.heading, intro = faqIntro.body, items = faqs, children }: FaqsProps) {
  const [open, setOpen] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const changed = useRef(false);

  useEffect(() => {
    if (!changed.current) return;
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  const toggle = (index: number) => {
    changed.current = true;
    setOpen((current) => (current === index ? null : index));
  };

  /* Arrow keys / Home / End move between questions. */
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const buttons = [...(listRef.current?.querySelectorAll<HTMLButtonElement>(".faq-toggle") ?? [])];
    const at = buttons.indexOf(event.currentTarget);
    const to = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: buttons.length - 1 }[event.key];
    if (to === undefined) return;
    event.preventDefault();
    buttons[(to + buttons.length) % buttons.length]?.focus();
  };

  return (
    <section id={sectionId} aria-labelledby={`${sectionId}-heading`} className="faq">
      <Container>
        <div className="faq-head">
          <h2 id={`${sectionId}-heading`} className="faq-heading">
            {heading}
          </h2>
          <p className="faq-intro">{intro}</p>
        </div>

        <div ref={listRef} className="faq-list">
          {items.map((faq, index) => {
            const isOpen = open === index;
            const id = `${sectionId}-${index + 1}`;
            return (
              <div key={faq.question} className="faq-item" data-open={isOpen || undefined}>
                <h3 className="faq-q">
                  <button
                    type="button"
                    id={`${id}-question`}
                    className="faq-toggle"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-answer`}
                    onClick={() => toggle(index)}
                    onKeyDown={onKeyDown}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <span className="faq-line" />
                      <span className="faq-line faq-line-v" />
                    </span>
                  </button>
                </h3>
                <div id={`${id}-answer`} role="region" aria-labelledby={`${id}-question`} className="faq-panel">
                  <div className="faq-panel-inner">
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {children}
      </Container>
    </section>
  );
}
