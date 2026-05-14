"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Inicio",      icon: "🏠", href: (id: string) => `/user/${id}/menu`       },
  { label: "Mis viajes",  icon: "🗂️", href: (id: string) => `/user/${id}/travels`    },
  { label: "Perfil",      icon: "👤", href: (id: string) => `/user/${id}/profile`     },
  { label: "Promo",       icon: "💰", href: (id: string) => `/user/${id}/promotions`  },
];

export default function BottomNav({ id }: { id: string }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[110] sm:hidden">
      {/* Glassmorphism bar */}
      <div className="bg-brand-surface/80 backdrop-blur-xl border-t border-brand-purple/30 shadow-[0_-4px_30px_#27103350]">
        <ul className="flex items-stretch">
          {NAV_ITEMS.map((item) => {
            const href = item.href(id);
            const isActive = pathname === href;

            return (
              <li key={item.label} className="flex-1">
                <Link
                  href={href}
                  className={`relative flex flex-col items-center justify-center gap-1 py-3 w-full transition-all duration-200 active:scale-95 ${
                    isActive ? "text-brand-accent" : "text-brand-purple/60"
                  }`}
                >
                  {/* Indicador activo */}
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-accent rounded-full shadow-[0_0_8px_#F500F1]" />
                  )}

                  <span
                    className={`text-2xl leading-none transition-transform duration-200 ${
                      isActive ? "scale-110" : "scale-100"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      isActive ? "text-brand-accent" : "text-brand-purple/50"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Safe area para iPhone */}
        <div className="h-safe-bottom bg-transparent" style={{ height: "env(safe-area-inset-bottom)" }} />
      </div>
    </nav>
  );
}
