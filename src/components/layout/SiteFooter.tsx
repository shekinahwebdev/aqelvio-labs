import { FooterLink } from "@/components/layout/FooterLink";
import { cacheLife } from "next/cache";
import { navigation } from "@/config/navigation";
import { site } from "@/config/site";
import { footerStatement } from "@/data/home-closing";

/*
 * Footer: statement and navigation above an oversized wordmark, after the
 * reference's layout. Links come from the site navigation (every route
 * exists). Contact details and social links are added only once they are
 * configured in site.ts; none are yet.
 */
export function SiteFooter() {
  const social = Object.entries(site.social);

  return (
    <footer className="ft" aria-labelledby="site-footer-title">
      <h2 id="site-footer-title" className="sr-only">
        {site.name}
      </h2>
      <div className="ft-inner">
        <div className="ft-top">
          <p className="ft-statement">{footerStatement}</p>

          <nav aria-label="Footer" className="ft-nav">
            <ul role="list" className="ft-links">
              {navigation.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href} className="ft-link">
                    {item.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
            {site.email || social.length ? (
              <ul role="list" className="ft-links">
                {site.email ? (
                  <li>
                    <a href={`mailto:${site.email}`} className="ft-link">
                      {site.email}
                    </a>
                  </li>
                ) : null}
                {social.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="ft-link" target="_blank" rel="noopener noreferrer">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </nav>
        </div>

        {/* The wordmark is decorative: the heading above names the site. */}
        <p className="ft-wordmark" aria-hidden="true">
          <span className="ft-word">{site.shortName}</span>
          <span className="ft-labs">Labs</span>
        </p>

        <p className="ft-copy">
          © <CopyrightYear /> {site.legalName}
        </p>
      </div>
    </footer>
  );
}

/* Cached for a day: the year stays current without making the page dynamic. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
