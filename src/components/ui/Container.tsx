import { cn } from "@/lib/utils";

type ContainerProps = {
  as?: "div" | "section" | "header" | "footer" | "nav" | "main";
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function Container({
  as: Tag = "div",
  id,
  className,
  children,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-[var(--container-pad)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
