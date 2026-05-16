import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Wrench,
  Sparkles,
  Settings,
  MoreHorizontal,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import ViajeEnCurso from "@/app/components/viajeEnCurso";
import BotonCancelarViaje from "@/app/components/BotonCancelarViaje";
import MenuSkeleton from "@/app/components/skeletons/MenuSkeleton";
import ActualizarEstadoViaje from "@/app/mocks/actualizarEstadoViaje";
import { getViajesByClienteId } from "@/lib/queries/viajes";
import { PageHeader, Pill, Button } from "@/app/components/ui";

const fmtFecha = (f?: Date | string | null) => {
  if (!f) return "Sin fecha";
  const d = typeof f === "string" ? new Date(f) : f;
  return d.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

async function MenuData({ id }: { id: string }) {
  const [viajes, user] = await Promise.all([
    getViajesByClienteId(parseInt(id)),
    currentUser(),
  ]);

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

  const saludo = user?.firstName
    ? `Hola, ${user.firstName}`
    : "Menú principal";

  const kpis = (
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

  return (
    <div className="py-2 sm:py-4 max-w-5xl mx-auto w-full">
      <PageHeader
        eyebrow="Inicio"
        title={saludo}
        description={
          viajeActivo
            ? "Seguimiento en vivo de tu servicio."
            : "¿Qué necesitás hoy?"
        }
      />

      {viajeActivo ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 items-start">
            <section className="space-y-4">
              <ViajeEnCurso
                idViaje={viajeActivo.id_viaje}
                idCliente={parseInt(id)}
                estadoInicial={viajeActivo.estado ?? "pendiente"}
              />
              {/* Mock temporal para simular transiciones de estado en dev */}
              <ActualizarEstadoViaje id={viajeActivo.id_viaje} />
            </section>
            <aside className="flex flex-col gap-3">
              {[
                "pendiente",
                "aceptado",
                "en camino",
                "ha llegado",
              ].includes((viajeActivo.estado ?? "").toLowerCase()) && (
                <BotonCancelarViaje idViaje={viajeActivo.id_viaje} />
              )}
              {kpis}
            </aside>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3 mb-6 items-stretch">
          <section
            className="rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-stretch gap-5 border border-rd-border-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(217,64,204,0.18), rgba(141,98,165,0.10))",
            }}
          >
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h2 className="text-xl font-bold text-rd-text">Nuevo trabajo</h2>
              <p className="text-sm text-rd-muted mt-1 leading-relaxed">
                Solicitá un servicio técnico verificado en minutos.
              </p>
            </div>
            <Button
              href={`/user/${id}/solicitudTrabajoActual`}
              size="lg"
              className="sm:!h-auto sm:self-stretch"
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
              href={`/user/${id}/travels`}
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
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "limpieza", label: "Limpieza", Icon: Sparkles },
            { key: "reparacion", label: "Reparación", Icon: Wrench },
            { key: "mantenimiento", label: "Mantenimiento", Icon: Settings },
            { key: "otro", label: "Otro", Icon: MoreHorizontal },
          ].map(({ key, label, Icon }) => {
            if (viajeActivo) {
              return (
                <div
                  key={key}
                  aria-disabled
                  className="rounded-xl p-4 bg-rd-surface border border-rd-border flex flex-col items-start gap-3 opacity-50 cursor-not-allowed select-none"
                >
                  <span className="w-10 h-10 rounded-lg bg-rd-elevated grid place-items-center text-rd-subtle">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <div>
                    <div className="font-semibold text-[14px] text-rd-text-2">
                      {label}
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
                key={key}
                href={`/user/${id}/solicitudTrabajoActual?categoria=${key}`}
                className="rounded-xl p-4 bg-rd-surface border border-rd-border hover:border-rd-border-3 hover:bg-rd-elevated transition-colors flex flex-col items-start gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-accent focus-visible:ring-offset-2 focus-visible:ring-offset-rd-bg"
              >
                <span className="w-10 h-10 rounded-lg bg-rd-elevated grid place-items-center text-rd-accent-soft group-hover:bg-rd-accent group-hover:text-white transition-colors">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <div>
                  <div className="font-semibold text-[14px] text-rd-text">
                    {label}
                  </div>
                  <div className="text-[11.5px] text-rd-muted mt-0.5">
                    Solicitar ahora →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

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
    <Suspense fallback={<MenuSkeleton />}>
      <MenuData id={id} />
    </Suspense>
  );
}
