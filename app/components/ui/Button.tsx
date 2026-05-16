import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg" | "xl";

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-tight " +
  "transition-colors duration-150 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-accent " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-rd-bg " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none " +
  "whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-rd-accent text-white hover:bg-[#C932BD]",
  secondary:
    "bg-rd-surface border border-rd-border-2 text-rd-text " +
    "hover:bg-rd-elevated hover:border-rd-border-3",
  ghost:
    "bg-transparent text-rd-text-2 hover:bg-rd-elevated hover:text-rd-text",
  danger:
    "bg-rd-danger-bg border border-rd-danger/30 text-rd-danger " +
    "hover:bg-rd-danger/20 hover:border-rd-danger/50",
  success:
    "bg-rd-ok-bg border border-rd-ok/30 text-rd-ok " +
    "hover:bg-rd-ok/20 hover:border-rd-ok/50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-xs rounded-lg",
  md: "h-11 px-4 text-sm rounded-xl",
  lg: "h-12 px-5 text-[15px] rounded-xl",
  xl: "h-14 px-7 text-base rounded-xl",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, "className" | "children" | "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  if ("href" in rest && rest.href) {
    return (
      <Link className={classes} {...(rest as ComponentProps<typeof Link>)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentProps<"button">)}>
      {children}
    </button>
  );
}
