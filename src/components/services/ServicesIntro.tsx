import { servicesIntro } from "@/data/service-catalog";
import { serviceCategories } from "@/data/service-categories";

/*
 * /services introduction: heading, short introduction and (after the
 * reference) a column of service labels that drifts upward in a seamless
 * loop (two copies of the list, moved by half their height in CSS). The
 * labels repeat the category titles, so the column is hidden from assistive
 * technology; with reduced motion it never moves.
 */
export function ServicesIntro() {
  const labels = serviceCategories.map((category) => category.title);
  const [lead, trail] = servicesIntro.heading;

  return (
    <section aria-labelledby="services-heading" className="svi">
      <div className="svi-inner">
        <div className="svi-copy">
          <h1 id="services-heading" className="svi-heading">
            <span className="svi-line">{lead}</span>{" "}
            <span className="svi-line">{trail}</span>
          </h1>
          <p className="svi-body">{servicesIntro.body}</p>
        </div>

        <div className="svi-marquee">
          <div className="svi-track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <ul key={copy} role="list" className="svi-list">
                {labels.map((label) => (
                  <li key={label} className="svi-tag">
                    {label}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
