import type { ReactNode } from "react";
import { cn } from "./cn";

export type PillTone = "ok" | "warn" | "danger" | "info" | "accent" | "mute";
export type PillSize = "sm" | "md";

const tones: Record<PillTone, string> = {
  ok: "text-rd-ok bg-rd-ok-bg border-rd-ok/30",
  warn: "text-rd-warn bg-rd-warn-bg border-rd-warn/30",
  danger: "text-rd-danger bg-rd-danger-bg border-rd-danger/30",
  info: "text-rd-info bg-rd-info-bg border-rd-info/30",
  accent: "text-rd-accent-soft bg-rd-accent-dim border-rd-accent/30",
  mute: "text-rd-muted bg-rd-bg border-rd-border",
};

const sizes: Record<PillSize, string> = {
  sm: "px-2 py-[2px] text-[10.5px]",
  md: "px-2.5 py-1 text-[11px]",
};

type PillProps = {
  tone?: PillTone;
  size?: PillSize;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  children: ReactNode;
};

export default function Pill({
  tone = "mute",
  size = "md",
  dot = false,
  pulse = false,
  className,
  children,
}: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide",
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full bg-current shrink-0",
            pulse && "animate-pulse",
          )}
        />
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}
