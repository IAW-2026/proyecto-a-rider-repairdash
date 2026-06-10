import { Suspense, cache } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Wrench,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { obtenerTrabajos } from "@/lib/actions/apis/driver/obtenerTrabajos";
import { obtenerInfoDriverPorViaje } from "@/lib/actions/apis/driver/obtenerInfoDriver";
import { currentUser } from "@clerk/nextjs/server";
import ViajeEnCurso from "./_components/ViajeEnCurso";
import MenuSkeleton from "@/app/components/skeletons/MenuSkeleton";
import { getViajesByClerkID } from "@/lib/queries/viajes";
import { PageHeader, Pill, Button } from "@/app/components/ui";
import { UserButton } from "@clerk/nextjs";

const fmtFecha = (f?: Date | string | null) => {
  if (!f) return "Sin fecha";
  const d = typeof f === "string" ? new Date(f) : f;
  return d.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const getCachedViajes = cache((idClerk: string) => getViajesByClerkID(idClerk));

async function UserGreeting() {
  const user = await currentUser();
  return <>{user?.firstName ? `Hola, ${user.firstName}` : "Menú principal"}</>;
}

async function MenuDescription({ idClerk }: { idClerk: string }) {
  const viajes = await getCachedViajes(idClerk);
  const viajeActivo = viajes.find(
    (v) => v.estado && v.estado.toLowerCase() !== "concluido",
  );
  return <>{viajeActivo ? "Seguimiento en vivo de tu servicio." : "¿Qué necesitás hoy?"}</>;
}

function Kpis({
  totalGastado,
  cantidadRealizados,
}: {
  totalGastado: number;
  cantidadRealizados: number;
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
      <div className="rounded-xl p-5 bg-rd-surface border border-rd-border flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-rd-muted">
            Total gastado
          </span>
          <span className="w-9 h-9 rounded-lg bg-rd-elevated grid place-items-center text-rd-accent-soft">
            <DollarSign size={16} strokeWidth={1.75} />
          </span>
        </div>
        <div className="tabular-rd text-2xl sm:text-3xl font-bold tracking-tight text-rd-text">
          $ {totalGastado.toLocaleString("es-AR")}
        </div>
        <div className="text-xs text-rd-muted">
          Sumatoria de trabajos concluidos.
        </div>
      </div>

      <div className="rounded-xl p-5 bg-rd-surface border border-rd-border flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-rd-muted">
            Viajes realizados
          </span>
          <span className="w-9 h-9 rounded-lg bg-rd-elevated grid place-items-center text-rd-accent-soft">
            <Briefcase size={16} strokeWidth={1.75} />
          </span>
        </div>
        <div className="tabular-rd text-2xl sm:text-3xl font-bold tracking-tight text-rd-text">
          {cantidadRealizados}
        </div>
        <div className="text-xs text-rd-muted">
          {cantidadRealizados === 1
            ? "Servicio concluido."
            : "Servicios concluidos."}
        </div>
      </div>
    </div>
  );
}

async function MenuContent({ idClerk }: { idClerk: string }) {
  const viajes = await getCachedViajes(idClerk);

  const viajeActivo = viajes.find(
    (v) => v.estado && v.estado.toLowerCase() !== "concluido",
  );
  const viajesConcluidos = viajes.filter(
    (v) => v.estado && v.estado.toLowerCase() === "concluido",
  );
  const viajesPasados = viajesConcluidos.slice(0, 4);

  const totalGastado = viajesConcluidos.reduce((acc, v) => {
    const monto = v.pagos?.[0]?.monto;
    if (monto == null) return acc;
    const n = Number(typeof monto === "number" || typeof monto === "string" ? monto : String(monto));
    return Number.isNaN(n) ? acc : acc + n;
  }, 0);
  const cantidadRealizados = viajesConcluidos.length;

  const kpis = (
    <Kpis totalGastado={totalGastado} cantidadRealizados={cantidadRealizados} />
  );

  const estadoActivoLower = viajeActivo?.estado?.toLowerCase() ?? "";
  const driverYaAsignado = ["aceptado", "en camino", "ha llegado"].includes(
    estadoActivoLower,
  );
  const driverInicial =
    viajeActivo && driverYaAsignado
      ? await obtenerInfoDriverPorViaje(viajeActivo.id_viaje).catch(() => null)
      : null;

  return (
    <>
      {viajeActivo ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 items-start">
            <section className="space-y-4">
              <ViajeEnCurso
                idViaje={viajeActivo.id_viaje}
                idClerk={idClerk}
                estadoInicial={viajeActivo.estado ?? "pendiente"}
                pagoEstadoInicial={viajeActivo.pagos?.[0]?.estado ?? null}
                driverInicial={driverInicial}
              />
            </section>
            <aside className="flex flex-col gap-3">
              {kpis}
            </aside>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3 mb-6 items-stretch">
          <section className="relative overflow-hidden rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-stretch gap-5 border border-rd-border-3 group min-h-[200px] sm:min-h-[172px]">
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-80"
              style={{
                background: "linear-gradient(135deg, rgba(217,64,204,0.18), rgba(141,98,165,0.10))",
              }}
            />
            <div className="relative z-10 flex-1 min-w-0 flex flex-col justify-center">
              <h2 className="text-xl font-bold text-rd-text">Nuevo trabajo</h2>
              <p className="text-sm text-rd-muted mt-1 leading-relaxed">
                Solicitá un servicio técnico verificado en minutos.
              </p>
            </div>
            <Button
              href={`/user/${idClerk}/solicitudTrabajoActual`}
              size="lg"
              className="relative z-10 sm:!h-auto sm:self-stretch"
            >
              Solicitar
              <ArrowRight size={16} strokeWidth={1.75} />
            </Button>
          </section>
          {kpis}
        </div>
      )}

      <section className="mt-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-rd-text">
            Últimos trabajos
          </h2>
          {viajesPasados.length > 0 && (
            <a
              href={`/user/${idClerk}/travels`}
              className="text-xs text-rd-accent-soft font-semibold hover:underline"
            >
              Ver todo →
            </a>
          )}
        </div>
        {viajesPasados.length > 0 ? (
          <div className="flex flex-col gap-2">
            {viajesPasados.slice(0, 4).map((v) => (
              <div
                key={v.id_viaje}
                className="rounded-xl px-4 py-3.5 bg-rd-surface border border-rd-border flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-lg bg-rd-elevated grid place-items-center text-rd-accent-soft shrink-0">
                    <Wrench size={16} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm capitalize text-rd-text truncate">
                      {v.tipo_de_trabajo}
                    </div>
                    <div className="text-[11.5px] text-rd-muted">
                      {fmtFecha(v.fecha)}
                    </div>
                  </div>
                </div>
                <Pill tone="ok" size="sm">
                  {v.estado}
                </Pill>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl p-6 text-center bg-rd-bg-2 border border-rd-border text-sm text-rd-muted">
            Aún no hay trabajos recientes.
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-rd-text">
            Solicitar por categoría
          </h2>
          {viajeActivo && (
            <span className="text-[11.5px] text-rd-muted">
              Deshabilitado · viaje en curso
            </span>
          )}
        </div>
        <Suspense fallback={<TrabajosDisponiblesSkeleton />}>
          <TrabajosDisponibles
            idClerk={idClerk}
            deshabilitado={Boolean(viajeActivo)}
          />
        </Suspense>
      </section>
    </>
  );
}

function TrabajosDisponiblesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl p-4 bg-rd-surface border border-rd-border h-[96px] animate-pulse"
        />
      ))}
    </div>
  );
}

async function TrabajosDisponibles({
  idClerk,
  deshabilitado,
}: {
  idClerk: string;
  deshabilitado: boolean;
}) {
  let tipos: { id: string; nombre: string }[] = [];
  try {
    tipos = await obtenerTrabajos();
  } catch {
    tipos = [];
  }

  if (tipos.length === 0) {
    return (
      <div className="rounded-xl p-6 text-center bg-rd-bg-2 border border-rd-border text-sm text-rd-muted">
        No hay categorías disponibles.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {tipos.map((t) => {
        if (deshabilitado) {
          return (
            <div
              key={t.id}
              aria-disabled
              className="rounded-xl p-4 bg-rd-surface border border-rd-border flex flex-col items-start gap-3 opacity-50 cursor-not-allowed select-none"
            >
              <span className="w-10 h-10 rounded-lg bg-rd-elevated grid place-items-center text-rd-subtle">
                <Wrench size={18} strokeWidth={1.75} />
              </span>
              <div>
                <div className="font-semibold text-[14px] text-rd-text-2">
                  {t.nombre}
                </div>
                <div className="text-[11.5px] text-rd-muted mt-0.5">
                  No disponible
                </div>
              </div>
            </div>
          );
        }
        return (
          <Link
            key={t.id}
            href={`/user/${idClerk}/solicitudTrabajoActual?tipoServicioId=${t.id}`}
            className="rounded-xl p-4 bg-rd-surface border border-rd-border hover:border-rd-border-3 hover:bg-rd-elevated transition-colors flex flex-col items-start gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-accent focus-visible:ring-offset-2 focus-visible:ring-offset-rd-bg"
          >
            <span className="w-10 h-10 rounded-lg bg-rd-elevated grid place-items-center text-rd-accent-soft group-hover:bg-rd-accent group-hover:text-white transition-colors">
              <Wrench size={18} strokeWidth={1.75} />
            </span>
            <div>
              <div className="font-semibold text-[14px] text-rd-text">
                {t.nombre}
              </div>
              <div className="text-[11.5px] text-rd-muted mt-0.5">
                Solicitar ahora →
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default async function Menu({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="py-2 sm:py-4 max-w-5xl mx-auto w-full px-4 relative">
      <div className="absolute top-0 right-4 sm:hidden w-20 h-20 flex items-center justify-center overflow-hidden">
        <div className="scale-[1.6] origin-center flex items-center justify-center w-full h-full">
          <UserButton />
        </div>
      </div>

      <PageHeader
        eyebrow="Inicio"
        size="large"
        title={
          <Suspense fallback="Menú principal">
            <UserGreeting />
          </Suspense>
        }
        description={
          <Suspense fallback="¿Qué necesitás hoy?">
            <MenuDescription idClerk={id} />
          </Suspense>
        }
      />
      <Suspense fallback={<MenuSkeleton />}>
        <MenuContent idClerk={id} />
      </Suspense>
    </div>
  );
}
