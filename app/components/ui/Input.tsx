import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

const fieldBase =
  "w-full px-3.5 py-3 rounded-xl text-sm outline-none " +
  "transition-colors bg-rd-inset border border-rd-border-2 text-rd-text " +
  "placeholder:text-rd-subtle " +
  "focus:border-rd-accent focus:bg-rd-bg " +
  "focus-visible:ring-2 focus-visible:ring-rd-accent/30 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

type Wrap = {
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
};

function FieldWrap({
  label,
  helperText,
  error,
  htmlFor,
  children,
  className,
}: Wrap & { htmlFor?: string; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-[12.5px] font-semibold text-rd-text-2 tracking-wide"
        >
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-rd-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-rd-muted">{helperText}</p>
      ) : null}
    </div>
  );
}

type InputProps = ComponentProps<"input"> & Wrap;

export function Input({
  label,
  helperText,
  error,
  className,
  id,
  ...props
}: InputProps) {
  return (
    <FieldWrap label={label} helperText={helperText} error={error} htmlFor={id}>
      <input
        id={id}
        className={cn(fieldBase, error && "border-rd-danger/60", className)}
        {...props}
      />
    </FieldWrap>
  );
}

type SelectProps = ComponentProps<"select"> & Wrap;

export function Select({
  label,
  helperText,
  error,
  className,
  id,
  children,
  ...props
}: SelectProps) {
  return (
    <FieldWrap label={label} helperText={helperText} error={error} htmlFor={id}>
      <select
        id={id}
        className={cn(
          fieldBase,
          "appearance-none cursor-pointer pr-10 " +
            "bg-[linear-gradient(45deg,transparent_50%,var(--color-rd-muted)_50%),linear-gradient(135deg,var(--color-rd-muted)_50%,transparent_50%)] " +
            "bg-no-repeat",
          error && "border-rd-danger/60",
          className,
        )}
        style={{
          backgroundPosition:
            "calc(100% - 18px) calc(50% - 2px), calc(100% - 13px) calc(50% - 2px)",
          backgroundSize: "5px 5px, 5px 5px",
        }}
        {...props}
      >
        {children}
      </select>
    </FieldWrap>
  );
}

type TextareaProps = ComponentProps<"textarea"> & Wrap;

export function Textarea({
  label,
  helperText,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  return (
    <FieldWrap label={label} helperText={helperText} error={error} htmlFor={id}>
      <textarea
        id={id}
        className={cn(
          fieldBase,
          "min-h-24 resize-none",
          error && "border-rd-danger/60",
          className,
        )}
        {...props}
      />
    </FieldWrap>
  );
}
