import type { ReactNode } from "react";
import { cn } from "./cn";

type Variant = "surface" | "glass" | "outline" | "inset";

const variants: Record<Variant, string> = {
  surface: "bg-rd-surface border border-rd-border",
  inset: "bg-rd-bg-2 border border-rd-border",
  glass: "bg-rd-surface/80 border border-rd-border-2 backdrop-blur-md",
  outline: "bg-transparent border border-rd-border",
};

type CardProps = {
  variant?: Variant;
  padded?: boolean;
  className?: string;
  children: ReactNode;
};

export default function Card({
  variant = "surface",
  padded = true,
  className,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        variants[variant],
        padded && "p-4 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
