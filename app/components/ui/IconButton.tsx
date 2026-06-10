import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "primary" | "ghost" | "soft" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-rd-accent text-white hover:bg-[#C932BD]",
  ghost:
    "bg-transparent text-rd-text-2 hover:bg-rd-elevated hover:text-rd-text",
  soft: "bg-rd-elevated text-rd-text hover:bg-rd-surface",
  danger:
    "bg-rd-danger-bg text-rd-danger border border-rd-danger/30 hover:border-rd-danger/50",
};

const sizes: Record<Size, string> = {
  sm: "w-8 h-8 rounded-lg",
  md: "w-10 h-10 rounded-xl",
  lg: "w-12 h-12 rounded-2xl",
};

type IconButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  rounded?: "default" | "full";
  children: ReactNode;
};

export default function IconButton({
  variant = "ghost",
  size = "md",
  rounded = "default",
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-colors duration-150 " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-accent " +
          "focus-visible:ring-offset-2 focus-visible:ring-offset-rd-bg " +
          "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        rounded === "full" && "!rounded-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
