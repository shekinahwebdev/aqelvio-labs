import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  showArrow?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function Button({
  href,
  children,
  variant = "primary",
  showArrow = false,
  className,
  onClick,
}: ButtonProps) {
  if (showArrow) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label={typeof children === "string" ? children : undefined}
        className={cn(
          "group inline-flex items-center gap-2.5 text-base tracking-[-0.02em] outline-none",
          "focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
      >
        <span
          className={cn(
            "inline-flex min-w-[10.5rem] items-center justify-center overflow-hidden rounded-[var(--radius-control)] px-8 py-[1.05rem] font-medium transition-[background-color,color] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
            variant === "primary" &&
              "bg-elevated-2 text-foreground group-hover:bg-hover",
            variant === "secondary" &&
              "border border-border text-foreground group-hover:border-foreground/40",
          )}
        >
          <span className="relative block overflow-hidden">
            <span className="block transition-transform duration-[220ms] ease-[var(--ease-out)] group-hover:-translate-y-[110%]">
              {children}
            </span>
            <span
              className="absolute inset-0 block translate-y-[110%] transition-transform duration-[220ms] ease-[var(--ease-out)] group-hover:translate-y-0"
              aria-hidden="true"
            >
              {children}
            </span>
          </span>
        </span>
        <span
          className={cn(
            "relative flex size-14 items-center justify-center overflow-hidden rounded-full",
            variant === "primary"
              ? "bg-foreground text-background"
              : "border border-border text-foreground",
          )}
          aria-hidden="true"
        >
          <ArrowUpRight
            className="absolute size-[18px] transition-transform duration-[220ms] ease-[var(--ease-out)] group-hover:translate-x-5 group-hover:-translate-y-5"
            strokeWidth={1.75}
          />
          <ArrowUpRight
            className="absolute size-[18px] -translate-x-5 translate-y-5 transition-transform duration-[220ms] ease-[var(--ease-out)] group-hover:translate-x-0 group-hover:translate-y-0"
            strokeWidth={1.75}
          />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-control)] px-6 py-[0.95rem] text-[0.9375rem] font-medium tracking-[-0.02em] transition-[background-color,border-color,color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)] outline-none",
        "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "primary" && "bg-elevated-2 text-foreground hover:bg-hover",
        variant === "secondary" &&
          "border border-border text-foreground hover:border-foreground/40",
        variant === "ghost" && "text-muted hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}
