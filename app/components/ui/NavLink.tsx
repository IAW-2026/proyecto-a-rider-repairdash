import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "./cn";

type NavLinkProps = {
  href: string;
  isActive: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function NavLink({
  href,
  isActive,
  icon,
  children,
  className,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "w-full px-3 py-2.5 rounded-lg font-semibold text-[13.5px] " +
          "flex items-center gap-3 transition-colors duration-150 " +
          "border " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-accent " +
          "focus-visible:ring-offset-2 focus-visible:ring-offset-rd-bg",
        isActive
          ? "bg-rd-elevated text-rd-text border-rd-border-2"
          : "text-rd-text-2 border-transparent hover:text-rd-text hover:bg-rd-elevated/60",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {icon && (
        <span
          className={cn(
            "shrink-0 inline-flex items-center justify-center",
            isActive ? "text-rd-accent-soft" : "text-rd-muted",
          )}
        >
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </Link>
  );
}
