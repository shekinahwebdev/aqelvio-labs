import { cn } from "@/lib/utils";

type StaggerTextProps = {
  id?: string;
  lines: string[];
  className?: string;
  lineClassName?: string;
  delayMs?: number;
};

export function StaggerText({
  id,
  lines,
  className,
  lineClassName,
  delayMs = 140,
}: StaggerTextProps) {
  return (
    <h1
      id={id}
      className={cn("font-display text-display text-foreground", className)}
    >
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden">
          <span
            className={cn("hero-line block xl:whitespace-nowrap", lineClassName)}
            style={{ animationDelay: `${delayMs + index * 95}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}
