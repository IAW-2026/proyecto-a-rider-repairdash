"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, User, Tag } from "lucide-react";
import { cn } from "@/app/components/ui";

type Item = {
  label: string;
  Icon: typeof Home;
  href: (id: string) => string;
  disabled?: boolean;
};

const NAV_ITEMS: Item[] = [
  { label: "Inicio", Icon: Home, href: (id) => `/user/${id}/menu` },
  { label: "Mis viajes", Icon: Briefcase, href: (id) => `/user/${id}/travels` },
  { label: "Perfil", Icon: User, href: (id) => `/user/${id}/profile` },
  { label: "Promos", Icon: Tag, href: (id) => `/mocks/promotions?id=${id}` },
];

const HIDE_THRESHOLD = 8;

export default function BarraInferior({ id }: { id: string }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastYRef.current;

      if (currentY <= 0) {
        setHidden(false);
      } else if (delta > HIDE_THRESHOLD) {
        setHidden(true);
      } else if (delta < -HIDE_THRESHOLD) {
        setHidden(false);
      }

      lastYRef.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setHidden(false);
  }, [pathname]);

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[110] sm:hidden transition-transform duration-300 ease-out will-change-transform",
        hidden ? "translate-y-full" : "translate-y-0",
      )}
      aria-hidden={hidden}
    >
      <div
        className="bg-rd-bg/90 backdrop-blur-xl border-t border-rd-border-2"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="flex items-stretch">
          {NAV_ITEMS.map(({ label, Icon, href, disabled }) => {
            const target = href(id);
            const isActive = !disabled && pathname === target;
            const content = (
              <span
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 py-3 w-full transition-colors",
                  isActive
                    ? "text-rd-accent-soft"
                    : disabled
                      ? "text-rd-subtle"
                      : "text-rd-muted hover:text-rd-text-2",
                )}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-rd-accent rounded-full" />
                )}
                <Icon size={20} strokeWidth={1.75} />
                <span
                  className="text-[10.5px] font-semibold"
                  style={{ letterSpacing: "0.08em" }}
                >
                  {label}
                </span>
              </span>
            );

            return (
              <li key={label} className="flex-1">
                {disabled ? (
                  <span
                    aria-disabled
                    className="cursor-not-allowed pointer-events-none block"
                  >
                    {content}
                  </span>
                ) : (
                  <Link href={target} className="block">
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
