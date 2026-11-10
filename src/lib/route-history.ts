/**
 * The previous and current pathname of client-side navigation, recorded by
 * InPageLinks (mounted once in the root layout). Lets a page tell how the
 * visitor arrived, e.g. /work restoring its place on return from a project.
 */
let previous: string | null = null;
let current: string | null = null;

export function recordPath(pathname: string) {
  if (pathname === current) return;
  previous = current;
  current = pathname;
}

export function previousPath(): string | null {
  return previous;
}
