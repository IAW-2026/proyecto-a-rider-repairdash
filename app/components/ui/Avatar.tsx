import { cn } from "./cn";

type AvatarProps = {
  name: string;
  size?: number;
  online?: boolean;
  className?: string;
};

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((s) => s[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function hueFromName(name: string): number {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return sum % 360;
}

export default function Avatar({
  name,
  size = 40,
  online = false,
  className,
}: AvatarProps) {
  const h = hueFromName(name);
  const dotSize = Math.round(size * 0.28);

  return (
    <div
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <div
        className="w-full h-full rounded-full grid place-items-center text-white font-bold"
        style={{
          background: `linear-gradient(135deg, hsl(${h} 50% 45%), hsl(${(h + 40) % 360} 60% 30%))`,
          fontSize: size * 0.34,
          letterSpacing: "-0.02em",
        }}
        aria-hidden
      >
        {initials(name)}
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full bg-rd-ok border-2 border-rd-bg"
          style={{ width: dotSize, height: dotSize }}
          aria-hidden
        />
      )}
    </div>
  );
}
