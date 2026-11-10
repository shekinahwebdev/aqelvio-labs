"use client";

import Link from "next/link";
import { navigation } from "@/config/navigation";
import { useCurrentPath } from "@/lib/use-current-path";
import { cn, isActivePath } from "@/lib/utils";

type NavigationProps = {
  className?: string;
  onNavigate?: () => void;
};

export function Navigation({ className, onNavigate }: NavigationProps) {
  const pathname = useCurrentPath();

  return (
    <ul className={cn("flex items-center gap-8", className)}>
      {navigation.map((item) => {
        const active = pathname ? isActivePath(pathname, item.href) : false;

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative text-[0.9375rem] tracking-[-0.02em] transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] outline-none",
                "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-[var(--duration-fast)] after:ease-[var(--ease-out)]",
                "hover:text-foreground hover:after:scale-x-100",
                "focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                active ? "text-foreground after:scale-x-100" : "text-muted",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
