import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, CheckCircle2 } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { getClienteByClerkID } from "@/lib/queries/clientes";
import { getViajesByClerkID } from "@/lib/queries/viajes";
import TablaViajes from "../_components/TablaViajes";
import IdentityCardSkeleton from "@/app/components/skeletons/IdentityCardSkeleton";
import ProfileHistorySkeleton from "@/app/components/skeletons/ProfileHistorySkeleton";

import {
  PageHeader,
  Stars,
  Avatar,
  Button,
  cn,
} from "@/app/components/ui";

const fmtMonto = (m?: unknown) => {
  if (m == null) return "—";
  const num = Number(typeof m === "number" || typeof m === "string" ? m : String(m));
  if (Number.isNaN(num)) return "—";
  return "$ " + num.toLocaleString("es-AR");
};


async function ProfileIdentityCard({ id }: { id: string }) {
  const [cliente, user] = await Promise.all([
    getClienteByClerkID(id),
    currentUser(),
  ]);

  const nombre = cliente?.nombre ?? user?.firstName ?? "Usuario";
  const apellido = cliente?.apellido ?? user?.lastName ?? "";
  const fullName = `${nombre} ${apellido}`.trim();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const calificacion = Number(cliente?.calificacion ?? 0);

  return (
    <div 
      className="rounded-2xl p-6 sm:p-7 border border-rd-border flex flex-col items-center text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, var(--color-rd-surface) 0%, var(--color-rd-bg-2) 100%)"
      }}
    >
      {user?.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt={`${fullName} avatar`}
          width={96}
          height={96}
          priority
          fetchPriority="high"
          className="w-[72px] h-[72px] sm:w-24 sm:h-24 rounded-full relative z-10"
        />
      ) : (
        <Avatar name={fullName} size={72} className="sm:w-24 sm:h-24" />
      )}

      <h2 className="text-xl sm:text-2xl font-bold text-rd-text mt-4 tracking-tight relative z-10">
        {fullName}
      </h2>
      {email && (
        <p className="text-sm text-rd-muted mt-1 break-all relative z-10">{email}</p>
      )}

      {calificacion > 0 && (
        <div className="mt-4 px-4 py-3 rounded-xl bg-rd-bg-2/50 border border-rd-border flex flex-col items-center gap-1.5 relative z-10">
          <Stars value={calificacion} size={16} />
          <div className="text-sm font-semibold tabular-rd text-rd-text">
            {calificacion.toFixed(1)}
            <span className="text-rd-muted font-normal"> / 5</span>
          </div>
        </div>
      )}

      <Button
        href="https://proyecto-a-payments-repairdash.vercel.app"
        className="w-full mt-5 relative z-10"
      >
        <CreditCard size={16} strokeWidth={1.75} />
        Ver balance y pagos
      </Button>
    </div>
  );
}



async function ProfileHistory({ id }: { id: string }) {
  const viajes = await getViajesByClerkID(id);

  // Preparar datos para el gráfico de barras (últimos 6 meses)
  const viajesPorMes = new Map<string, number>();
  const mesesLabels = [];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    // Español corto: "Ene", "Feb", etc.
    const key = d.toLocaleString("es-AR", { month: "short" }).replace(".", "");
    mesesLabels.push(key);
    viajesPorMes.set(key, 0);
  }

  // Filtrar y contar solo viajes de los últimos 6 meses
  const seisMesesAtras = new Date();
  seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 5);
  seisMesesAtras.setDate(1);

  viajes.forEach((v) => {
    if (v.fecha) {
      const d = typeof v.fecha === "string" ? new Date(v.fecha) : v.fecha;
      if (d >= seisMesesAtras) {
        const key = d.toLocaleString("es-AR", { month: "short" }).replace(".", "");
        if (viajesPorMes.has(key)) {
          viajesPorMes.set(key, viajesPorMes.get(key)! + 1);
        }
      }
    }
  });

  const chartData = mesesLabels.map((m) => ({
    mes: m.charAt(0).toUpperCase() + m.slice(1),
    cantidad: viajesPorMes.get(m)!,
  }));
  const maxViajes = Math.max(...chartData.map((d) => d.cantidad), 1);

  return (
    <>
      <div className="flex flex-col gap-5">
        <section className="rounded-2xl p-6 bg-rd-surface border border-rd-border">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-bold text-rd-text">
              Actividad reciente
            </h2>
            <Link
              href={`/user/${id}/travels`}
              className="text-xs text-rd-accent-soft font-semibold hover:underline"
            >
              Ver detalles →
            </Link>
          </div>

          <p className="text-sm text-rd-muted mb-6">
            Cantidad de viajes solicitados en los últimos 6 meses.
          </p>

          <div className="flex items-end justify-between h-44 w-full pt-2 border-b border-rd-border-2">
            {chartData.map((d, i) => {
              const isZero = d.cantidad === 0;
              const heightPct = isZero ? 4 : (d.cantidad / maxViajes) * 100;
              
              return (
                <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                  <div
                    className={cn(
                      "text-[12px] font-bold tabular-rd transition-colors",
                      isZero ? "text-transparent" : "text-rd-text"
                    )}
                  >
                    {d.cantidad}
                  </div>
                  <div className="w-full px-1 sm:px-2 flex justify-center">
                    <div 
                      className="w-full max-w-[32px] sm:max-w-[40px] bg-rd-bg-2 border border-rd-border-2 rounded-t-xl overflow-hidden relative flex flex-col justify-end"
                      style={{ height: "120px" }}
                    >
                      <div
                        className="w-full rounded-t-xl transition-all duration-1000 origin-bottom"
                        style={{
                          height: `${heightPct}%`,
                          background: "linear-gradient(to top, var(--color-rd-purple), var(--color-rd-accent))",
                          opacity: isZero ? 0 : 1,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold text-rd-muted mt-1 mb-2">
                    {d.mes}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-6 lg:col-span-2">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-rd-text">
            Historial reciente
          </h2>
          {viajes.length > 10 && (
            <Link
              href={`/user/${id}/travels`}
              className="text-sm text-rd-accent-soft font-semibold hover:underline"
            >
              Ver todo →
            </Link>
          )}
        </div>
        <TablaViajes filas={viajes.slice(0, 10)} />
      </section>
    </>
  );
}


export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="py-2 sm:py-4 max-w-6xl mx-auto w-full">
      <PageHeader
        eyebrow="Cliente · Perfil"
        size="large"
        title="Perfil de cuenta"
        description="Información de tu cuenta y resumen de actividad."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-5 lg:gap-6">
        <Suspense fallback={<IdentityCardSkeleton />}>
          <ProfileIdentityCard id={id} />
        </Suspense>
        
        <Suspense fallback={<ProfileHistorySkeleton />}>
          <ProfileHistory id={id} />
        </Suspense>
      </div>
    </div>
  );
}
