import type { ReactNode } from "react";
import { cn } from "./cn";

type Size = "default" | "large";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  size?: Size;
  actions?: ReactNode;
  leading?: ReactNode;
  gradient?: boolean;
  className?: string;
};

export default function PageHeader({
  title,
  description,
  eyebrow,
  size = "default",
  actions,
  leading,
  gradient = false,
  className,
}: PageHeaderProps) {
  const titleSize =
    size === "large"
      ? "text-3xl sm:text-5xl lg:text-6xl"
      : "text-2xl sm:text-[28px] lg:text-[32px]";

  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6",
        className,
      )}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {leading}
        <div className="space-y-1.5 min-w-0">
          {eyebrow && (
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-rd-muted">
              {eyebrow}
            </div>
          )}
          <h1
            className={cn(
              "font-bold tracking-tight",
              titleSize,
              gradient
                ? "bg-gradient-to-r from-rd-accent via-rd-accent-soft to-rd-lavender bg-clip-text text-transparent"
                : "text-rd-text",
            )}
          >
            {title}
          </h1>
          {description && (
            <p className="text-sm text-rd-muted leading-relaxed">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
      )}
    </header>
  );
}
