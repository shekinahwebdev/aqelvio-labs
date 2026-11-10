import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/config/site";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70svh] flex-col justify-center py-24">
      <p className="text-label font-medium uppercase tracking-[var(--tracking-label)] text-muted">
        404
      </p>
      <h1 className="mt-4 font-display text-h1 font-medium tracking-[var(--tracking-heading)]">
        This page is not here.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The URL may have changed, or the page has not been built yet.
      </p>
      <div className="mt-8">
        <Button href="/" showArrow>
          Back to {site.shortName}
        </Button>
      </div>
    </Container>
  );
}
