import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { Faqs } from "@/components/home/Faqs";
import { PricingReveal } from "@/components/pricing/PricingReveal";
import { Button } from "@/components/ui/Button";
import {
  costTypes,
  engagementComparison,
  engagementModels,
  formatApprovedPrice,
  hostingOptions,
  howWeWork,
  offeringsIntro,
  pricedOfferings,
  pricingFaqIntro,
  pricingFaqs,
  pricingHero,
  pricingModelLabels,
  quoteComponents,
  quoteHref,
} from "@/data/engagement";

/*
 * /pricing: how Aqelvio Labs scopes, quotes and supports work. Not a SaaS
 * price table: no amounts are published (see engagement.ts). Sections run
 * from the overview (engagement models) to the detail (what a quote is
 * made of, running costs, hosting), then the process, the services with
 * their pricing models (collapsed), and FAQs. The shared call to action
 * and footer follow from the layout.
 */
export function PricingView() {
  return (
    <PricingReveal>
      <Hero />
      <Models />
      <Comparison />
      <QuoteComponents />
      <Costs />
      <Hosting />
      <HowWeWork />
      <Offerings />
      <Faqs id="pricing-faqs" heading={pricingFaqIntro.heading} intro={pricingFaqIntro.body} items={pricingFaqs}>
        <p className="pr-faq-more">
          Have a different question?{" "}
          <Link href={quoteHref} className="pr-link">
            Ask us directly
          </Link>
          .
        </p>
      </Faqs>
    </PricingReveal>
  );
}

function SectionLabel({ number, name }: { number: string; name: string }) {
  return (
    <p className="pr-label" aria-hidden="true">
      <span>{number}</span>
      <span className="pr-label-name">{name}</span>
    </p>
  );
}

function Hero() {
  const [lead, trail] = pricingHero.heading;
  return (
    <header className="pr-hero">
      <p className="pr-eyebrow">{pricingHero.eyebrow}</p>
      <h1 className="pr-title">
        <span className="pr-title-line">{lead}</span> <span className="pr-title-line">{trail}</span>
      </h1>
      <div className="pr-hero-copy">
        <p className="pr-lede">{pricingHero.body}</p>
        <p className="pr-hero-note">{pricingHero.note}</p>
        <div className="pr-actions">
          <Button href={pricingHero.primary.href} showArrow>
            {pricingHero.primary.label}
          </Button>
          <Button href={pricingHero.secondary.href} variant="secondary" showArrow>
            {pricingHero.secondary.label}
          </Button>
        </div>
      </div>
    </header>
  );
}

function Models() {
  return (
    <section className="pr-section" aria-labelledby="pr-models">
      <SectionLabel number="01" name="Engagement models" />
      <h2 id="pr-models" className="pr-heading" data-pr-in>
        Three ways to work with us.
      </h2>
      <ol role="list" className="pr-models">
        {engagementModels.map((model) => (
          <li key={model.id} className="pr-model" aria-labelledby={`${model.id}-title`} data-pr-in>
            <p className="pr-model-number" aria-hidden="true">
              {model.number}
            </p>
            <h3 id={`${model.id}-title`} className="pr-model-title">
              {model.title}
            </h3>
            <p className="pr-model-for">{model.forWhom}</p>
            <p className="pr-small-label">{model.includesLabel}</p>
            <ul role="list" className="pr-checks">
              {model.includes.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" size={16} strokeWidth={1.75} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="pr-model-foot">
              <p className="pr-small-label">Pricing</p>
              <p className="pr-model-price">{model.pricing}</p>
              <p className="pr-model-note">{model.pricingNote}</p>
              <Link href={model.cta.href} className="pr-pill">
                {model.cta.label}
                <span className="sr-only">: {model.title}</span>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Comparison() {
  const titles = engagementModels.map((model) => model.title);
  return (
    <section className="pr-section pr-section-tight" aria-labelledby="pr-compare">
      <h2 id="pr-compare" className="pr-subheading" data-pr-in>
        {engagementComparison.heading}
      </h2>
      <div className="pr-table-wrap" data-pr-in>
        <table className="pr-table">
          <caption className="sr-only">
            How Build &amp; Handover, Build &amp; Maintain and Fully Managed differ
          </caption>
          <thead>
            <tr>
              <td />
              {titles.map((title) => (
                <th key={title} scope="col">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {engagementComparison.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, i) => (
                  <td key={titles[i]} data-label={titles[i]}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="pr-fine" data-pr-in>
        {engagementComparison.note}
      </p>
    </section>
  );
}

function QuoteComponents() {
  return (
    <section className="pr-section" aria-labelledby="pr-quote">
      <SectionLabel number="02" name="Project quotes" />
      <div className="pr-split">
        <div data-pr-in>
          <h2 id="pr-quote" className="pr-heading">
            {quoteComponents.heading}
          </h2>
          <p className="pr-text">{quoteComponents.intro}</p>
        </div>
        <ol className="pr-rows" data-pr-in>
          {quoteComponents.items.map((item, i) => (
            <li key={item.title} className="pr-row">
              <span className="pr-row-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="pr-row-title">{item.title}</span>
              <span className="pr-row-text">{item.text}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="pr-notes" data-pr-in>
        {quoteComponents.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>
    </section>
  );
}

function Costs() {
  const [lead, trail] = costTypes.heading;
  return (
    <section className="pr-section" aria-labelledby="pr-costs">
      <SectionLabel number="03" name="Running costs" />
      <div className="pr-band" data-pr-in>
        <h2 id="pr-costs" className="pr-heading pr-heading-wide">
          <span className="pr-title-line">{lead}</span> <span className="pr-title-line pr-muted">{trail}</span>
        </h2>
        <p className="pr-text">{costTypes.intro}</p>
        <ul role="list" className="pr-costs">
          {costTypes.items.map((item, i) => (
            <li key={item.title} className="pr-cost">
              <p className="pr-cost-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="pr-cost-title">{item.title}</h3>
              <p className="pr-cost-frequency">{item.frequency}</p>
              <p className="pr-cost-text">{item.text}</p>
            </li>
          ))}
        </ul>
        <div className="pr-changes">
          <h3 className="pr-small-heading">{costTypes.changes.heading}</h3>
          <ul role="list" className="pr-tags">
            {costTypes.changes.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <p className="pr-fine">{costTypes.changes.note}</p>
        </div>
      </div>
    </section>
  );
}

function Hosting() {
  return (
    <section className="pr-section" aria-labelledby="pr-hosting">
      <SectionLabel number="04" name="Hosting and billing" />
      <h2 id="pr-hosting" className="pr-heading" data-pr-in>
        {hostingOptions.heading}
      </h2>
      <p className="pr-text" data-pr-in>
        {hostingOptions.intro}
      </p>
      <div className="pr-options">
        {hostingOptions.options.map((option) => (
          <article key={option.id} className="pr-option" aria-labelledby={`${option.id}-title`} data-pr-in>
            <p className="pr-option-tag">{option.tag}</p>
            <h3 id={`${option.id}-title`} className="pr-option-title">
              {option.title}
            </h3>
            <ul role="list" className="pr-checks">
              {option.points.map((point) => (
                <li key={point}>
                  <Check aria-hidden="true" size={16} strokeWidth={1.75} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="pr-agreement" data-pr-in>
        <h3 className="pr-small-heading">{hostingOptions.agreement.heading}</h3>
        <ul role="list" className="pr-tags">
          {hostingOptions.agreement.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HowWeWork() {
  return (
    <section className="pr-section" aria-labelledby="pr-process">
      <SectionLabel number="05" name="Process" />
      <h2 id="pr-process" className="pr-heading" data-pr-in>
        {howWeWork.heading}
      </h2>
      <p className="pr-steps-path" aria-hidden="true" data-pr-in>
        {howWeWork.steps.map((step) => step.title).join(" → ")}
      </p>
      <ol className="pr-steps">
        {howWeWork.steps.map((step, i) => (
          <li key={step.title} className="pr-step" data-pr-in>
            <span className="pr-step-index" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="pr-step-title">{step.title}</h3>
            <p className="pr-step-text">{step.text}</p>
          </li>
        ))}
      </ol>
      <p className="pr-proposal" data-pr-in>
        {howWeWork.proposal}
      </p>
    </section>
  );
}

function Offerings() {
  return (
    <section className="pr-section" aria-labelledby="pr-offerings">
      <SectionLabel number="06" name="Services" />
      <div className="pr-split">
        <div data-pr-in>
          <h2 id="pr-offerings" className="pr-heading">
            {offeringsIntro.heading}
          </h2>
          <p className="pr-text">{offeringsIntro.intro}</p>
        </div>
        <ul role="list" className="pr-offerings" data-pr-in>
          {pricedOfferings.map((offering) => (
            <li key={offering.id}>
              <details className="pr-offering">
                <summary className="pr-offering-summary">
                  <span className="pr-offering-name">{offering.name}</span>
                  <span className="pr-offering-price">
                    {offering.startingPrice ? formatApprovedPrice(offering.startingPrice) : offering.fallback}
                  </span>
                  <span className="pr-offering-icon" aria-hidden="true">
                    <span className="faq-line" />
                    <span className="faq-line faq-line-v" />
                  </span>
                </summary>
                <div className="pr-offering-body">
                  <p className="pr-offering-text">{offering.description}</p>
                  {offering.collaboration ? <p className="pr-collab">{offering.collaboration}</p> : null}
                  <dl className="pr-offering-meta">
                    <div>
                      <dt>Pricing model</dt>
                      <dd>{pricingModelLabels[offering.pricingModel]}</dd>
                    </div>
                    <div>
                      <dt>Usually covers</dt>
                      <dd>
                        <ul role="list" className="pr-mini-list">
                          {offering.deliverables.map((item) => (
                            <li key={item}>
                              <Check aria-hidden="true" size={14} strokeWidth={1.75} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                    <div>
                      <dt>Quoted separately</dt>
                      <dd>
                        <ul role="list" className="pr-mini-list">
                          {offering.exclusions.map((item) => (
                            <li key={item}>
                              <Minus aria-hidden="true" size={14} strokeWidth={1.75} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                  <Link href={offering.cta.href} className="pr-pill">
                    {offering.cta.label}
                    <span className="sr-only">: {offering.name}</span>
                  </Link>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
