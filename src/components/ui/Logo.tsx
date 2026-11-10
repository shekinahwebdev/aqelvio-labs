import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function Logo({ className, showWordmark = true, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={cn(
        "group inline-flex w-fit max-w-full items-center gap-3.5 rounded-sm outline-none",
        "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-0",
        className,
      )}
      aria-label={`${site.name} home`}
    >
      <Mark />
      {showWordmark ? (
        <span className="font-display text-[1.25rem] font-medium tracking-[-0.03em] text-foreground">
          {site.shortName}
          <span className="ml-1.5 font-normal text-muted">Labs</span>
        </span>
      ) : null}
    </Link>
  );
}

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-10 shrink-0", className)}
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="8"
        className="fill-elevated-2 stroke-border"
        strokeWidth="1"
      />
      <path
        d="M9.5 23.5 16 8.5l6.5 15"
        fill="none"
        className="stroke-foreground"
        strokeWidth="1.9"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M12.2 17.6h7.6"
        fill="none"
        className="stroke-foreground"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="16" cy="8.5" r="1.35" className="fill-accent" />
    </svg>
  );
}
