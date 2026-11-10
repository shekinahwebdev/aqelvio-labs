import Link from "next/link";
import { PricingReveal } from "@/components/pricing/PricingReveal";
import { serviceCategories } from "@/data/service-categories";

/*
 * /services overview: what we offer, by category (service-categories.ts),
 * before the design panels in detail. Collaboration-delivered categories
 * say so on the card. Ends with a pointer to how pricing works.
 */
export function ServiceCategories() {
  return (
    <PricingReveal>
      <section className="svc" aria-labelledby="svc-heading">
        <p className="pr-label" aria-hidden="true">
          <span>What we offer</span>
          <span className="pr-label-name">{serviceCategories.length} areas</span>
        </p>
        <h2 id="svc-heading" className="pr-heading" data-pr-in>
          Software, websites and apps, with design throughout.
        </h2>
        <ul role="list" className="svc-grid">
          {serviceCategories.map((category, i) => (
            <li key={category.id} id={category.id} className="svc-card" aria-labelledby={`${category.id}-title`} data-pr-in>
              <p className="svc-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 id={`${category.id}-title`} className="svc-title">
                {category.title}
              </h3>
              <p className="svc-summary">{category.summary}</p>
              <ul role="list" className="svc-offerings">
                {category.offerings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {category.delivery.kind === "collaboration" ? (
                <p className="svc-collab">{category.delivery.note}</p>
              ) : null}
              {category.detailHref ? (
                <Link href={category.detailHref} className="pr-link svc-more">
                  See the design services below<span className="sr-only">: {category.title}</span>
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="pricing-pointer svc-pointer" data-pr-in>
          Every project is quoted for its scope. <Link href="/pricing">See how pricing and engagements work</Link>.
        </p>
      </section>
    </PricingReveal>
  );
}
