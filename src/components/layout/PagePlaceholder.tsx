import { Container } from "@/components/ui/Container";

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  /** Anchor for in-page links to this content. */
  id?: string;
};

export function PagePlaceholder({ eyebrow, title, id }: PagePlaceholderProps) {
  return (
    <Container id={id} className="flex min-h-[70svh] flex-col justify-center py-24">
      <p className="text-label font-medium uppercase tracking-[var(--tracking-label)] text-muted">
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-3xl font-display text-h1">{title}</h1>
      <p className="mt-5 max-w-md text-muted">
        This page is intentionally unfinished. Navigation and the homepage hero
        are ready for review first.
      </p>
    </Container>
  );
}
