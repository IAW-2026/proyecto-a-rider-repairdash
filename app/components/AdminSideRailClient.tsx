"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Users, Wrench } from "lucide-react";
import { cn } from "@/app/components/ui";

type Item = { id: string; label: string; href: string };

const iconFor = (id: string) => {
  if (id === "clientes") return Users;
  return Users;
};

export default function AdminSideRailClient({
  items,
  mobile = false,
}: {
  items: Item[];
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (mobile) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden w-10 h-10 rounded-xl inline-flex items-center justify-center text-rd-text-2 hover:bg-rd-elevated transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>

        {open && (
          <div
            className="lg:hidden fixed inset-0 z-[90] backdrop-blur-sm bg-rd-bg/70"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={cn(
            "lg:hidden fixed inset-y-0 left-0 z-[100] w-72 bg-rd-bg-2 border-r border-rd-border-2 flex flex-col transform transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between px-4 pt-5 pb-5 border-b border-rd-border">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-rd-accent grid place-items-center text-white">
                <Wrench size={17} strokeWidth={1.75} />
              </span>
              <span className="leading-tight">
                <span className="text-[15px] font-bold tracking-tight block">
                  Repair<span className="text-rd-accent">Dash</span>
                </span>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-rd-muted">
                  Admin
                </span>
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-lg inline-flex items-center justify-center text-rd-text-2 hover:bg-rd-elevated transition-colors"
              aria-label="Cerrar menú"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>
          <nav className="px-3 py-3 flex flex-col gap-1">
            {items.map((item) => {
              const Icon = iconFor(item.id);
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "px-3 py-2.5 rounded-lg font-semibold text-[13.5px] flex items-center gap-3 transition-colors border",
                    isActive
                      ? "bg-rd-elevated text-rd-text border-rd-border-2"
                      : "text-rd-text-2 border-transparent hover:text-rd-text hover:bg-rd-elevated/60",
                  )}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.75}
                    className={isActive ? "text-rd-accent-soft" : "text-rd-muted"}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
      </>
    );
  }

  return (
    <>
      {items.map((item) => {
        const Icon = iconFor(item.id);
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "px-3 py-2.5 rounded-lg font-semibold text-[13.5px] flex items-center gap-3 transition-colors border",
              isActive
                ? "bg-rd-elevated text-rd-text border-rd-border-2"
                : "text-rd-text-2 border-transparent hover:text-rd-text hover:bg-rd-elevated/60",
            )}
          >
            <Icon
              size={16}
              strokeWidth={1.75}
              className={isActive ? "text-rd-accent-soft" : "text-rd-muted"}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}
