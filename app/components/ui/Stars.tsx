import { Star } from "lucide-react";
import { cn } from "./cn";

type StarsProps = {
  value: number;
  size?: number;
  className?: string;
};

export default function Stars({ value, size = 14, className }: StarsProps) {
  const clamped = Math.max(0, Math.min(5, value));
  const full = Math.round(clamped * 2) / 2;

  return (
    <div
      className={cn("inline-flex gap-0.5 text-[#E8B45C]", className)}
      aria-label={`Calificación ${clamped.toFixed(1)} de 5`}
      role="img"
    >
      {[1, 2, 3, 4, 5].map((i) => {
        if (full >= i) {
          return (
            <Star
              key={i}
              size={size}
              fill="currentColor"
              strokeWidth={1.5}
              aria-hidden
            />
          );
        }
        if (full >= i - 0.5) {
          return (
            <span
              key={i}
              className="relative inline-block"
              style={{ width: size, height: size }}
              aria-hidden
            >
              <Star
                size={size}
                strokeWidth={1.75}
                className="absolute inset-0 text-[#E8B45C]/40"
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: "50%" }}
              >
                <Star
                  size={size}
                  fill="currentColor"
                  strokeWidth={1.5}
                />
              </span>
            </span>
          );
        }
        return (
          <Star
            key={i}
            size={size}
            strokeWidth={1.75}
            className="text-[#E8B45C]/40"
            aria-hidden
          />
        );
      })}
    </div>
  );
}
