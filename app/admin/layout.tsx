import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Wrench, Users } from "lucide-react";
import BarraLateralAdmin from "./_components/BarraLateralAdmin";
import { Pill } from "@/app/components/ui";

const NAV = [
  { id: "clientes", label: "Clientes", href: "/admin", Icon: Users },
] as const;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const nombre = user?.firstName ?? "";
  const apellido = user?.lastName ?? "";

  return (
    <div className="min-h-screen flex">
      {/* Desktop side rail */}
      <aside className="hidden lg:flex w-[240px] shrink-0 border-r border-rd-border-2 bg-rd-bg-2 flex-col">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 px-4 pt-5 pb-5 border-b border-rd-border"
        >
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
        </Link>

        <nav className="px-3 py-3 flex flex-col gap-1">
          <BarraLateralAdmin items={NAV.map((n) => ({ id: n.id, label: n.label, href: n.href }))} />
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-rd-border-2 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 lg:px-8 flex items-center justify-between bg-rd-bg/60 backdrop-blur-md">
          <BarraLateralAdmin
            items={NAV.map((n) => ({ id: n.id, label: n.label, href: n.href }))}
            mobile
          />
          <div className="flex items-center gap-3">
            <Pill tone="ok" dot pulse>
              Realtime · activo
            </Pill>
            <div className="flex items-center gap-2.5">
              <UserButton />
              <div className="hidden sm:flex flex-col text-right leading-tight">
                <span className="text-[13px] font-semibold text-rd-text">
                  {nombre} {apellido}
                </span>
                <span className="text-[11px] text-rd-muted">Administrador</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-6 lg:px-9 py-6 lg:py-7">{children}</main>
      </div>
    </div>
  );
}
