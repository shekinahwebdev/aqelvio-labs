import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";
import { copyrightHolder, legalMeta, legalSections } from "@/data/legal";

export function LegalView() {
  return (
    <article className="lg">
      <Container className="lg-inner">
        <header className="lg-head">
          <p className="lg-eyebrow">{site.eyebrow}</p>
          <h1 className="lg-title">{legalMeta.title}</h1>
          <p className="lg-lead">{legalMeta.description}</p>
          <p className="lg-updated">
            Last updated{" "}
            <time dateTime={legalMeta.updated}>
              {new Date(`${legalMeta.updated}T12:00:00`).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </p>
        </header>

        <div className="lg-notice" role="note">
          <p className="lg-notice-title">Copyright notice</p>
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved. Copyright holder:{" "}
            {copyrightHolder}. Unauthorized copying, cloning, or redistribution of this website
            or its source code is prohibited.
          </p>
        </div>

        <nav className="lg-toc" aria-label="On this page">
          <p className="lg-toc-label">On this page</p>
          <ol className="lg-toc-list">
            {legalSections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="lg-toc-link">
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="lg-body">
          {legalSections.map((section) => (
            <section key={section.id} id={section.id} className="lg-section" aria-labelledby={`${section.id}-h`}>
              <h2 id={`${section.id}-h`} className="lg-h2">
                {section.heading}
              </h2>
              {section.paragraphs.map((text) => (
                <p key={text.slice(0, 48)} className="lg-p">
                  {text}
                </p>
              ))}
              {section.bullets ? (
                <ul className="lg-ul">
                  {section.bullets.map((item) => (
                    <li key={item.slice(0, 48)}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <p className="lg-footer">
          Questions or permission requests?{" "}
          <Link href="/contact" className="lg-inline-link">
            Contact us
          </Link>
          . Repository license: see{" "}
          <a
            href="https://github.com/shekinahwebdev/aqelvio-labs/blob/main/LICENSE"
            className="lg-inline-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            LICENSE
          </a>{" "}
          on GitHub.
        </p>
      </Container>
    </article>
  );
}
