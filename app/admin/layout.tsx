import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { Pill } from "@/app/components/ui";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const nombre = user?.firstName ?? "";
  const apellido = user?.lastName ?? "";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b border-rd-border-2 px-safe-page sm:px-8 lg:px-10 flex items-center justify-between bg-rd-bg/60 backdrop-blur-md">
        <Link href="/admin" className="flex items-center gap-2.5">
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

      <main className="flex-1 px-safe-page sm:px-8 lg:px-10 py-6 lg:py-7">
        {children}
      </main>
    </div>
  );
}
