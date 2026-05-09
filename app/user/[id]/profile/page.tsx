import { Show, UserButton } from "@clerk/nextjs";
import { getClienteID } from "@/lib/actions/clientes";
import { getViajesByClienteId } from "@/lib/queries/viajes";
import TablaViajes from "@/app/components/TablaViajes";
import { Suspense } from "react";
import ProfileSkeleton from "@/app/components/skeletons/ProfileSkeleton";
import Link from "next/link";

function renderStars(rating: number) {
  const normalized = Math.max(0, Math.min(5, rating));

  return Array.from({ length: 5 }, (_, index) => {
    const filled = normalized >= index + 1;
    return (
      <span
        key={index}
        className={`text-2xl ${filled ? "text-amber-400" : "text-brand-purple/30"}`}
        aria-hidden="true"
      >
        ★
      </span>
    );
  });
}

async function ProfileData({ id }: { id: string }) {
  const [cliente, viajes] = await Promise.all([
    getClienteID(id),
    getViajesByClienteId(Number(id)),
  ]);

  const nombre = cliente?.nombre;
  const apellido = cliente?.apellido;
  const calificacion = Number(cliente?.calificacion ?? 0);
  const ultimos4Viajes = viajes.slice(0, 4);
  
  return (
    <div className="py-6 space-y-8">
      {/* Header */}
      <h1 className="text-4xl font-extrabold tracking-tight text-brand-text">
        Mi Perfil
      </h1>

      {/* Profile card */}
      <div
        className="rounded-2xl p-8 flex flex-col items-center gap-4 bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-md"
      >
          <Show when="signed-in">
              <div className="w-24 h-24 rounded-full border-[3px] border-brand-accent shadow-[0_0_20px_#F500F170] flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
                <div className="scale-[3] origin-center flex items-center justify-center w-full h-full">
                  <UserButton />
                </div>
              </div>
          </Show>
        
        <div className="text-center">
          <p className="text-xl font-bold text-brand-text">{nombre} {apellido}</p>
        </div>

        {/* pedir las calificcaiones a feedback*/}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1" aria-label={`Calificación ${calificacion.toFixed(1)} de 5`}>
            {renderStars(calificacion)}
          </div>
          <p className="text-sm font-semibold text-brand-lavender">
            Calificación {calificacion.toFixed(1)} / 5
          </p>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="https://proyecto-a-payments-repairdash-lvnq2cmkm.vercel.app/driver"
            className="flex-1 inline-flex items-center justify-center rounded-xl px-5 py-3.5 font-bold text-base tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-95 bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-brand-text shadow-[0_0_16px_#F500F150]"
          >
            Ver balance y pagos
          </Link>
        </div>

        <div
          className="w-full rounded-xl px-4 py-3 text-center mt-2 bg-brand-accent/10 border border-brand-accent/30"
        >
          <p className="text-sm text-brand-lavender">
            Historial completo y resumen reciente de tus viajes.
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">Últimos 4 viajes</h2>
          <p className="mt-1 text-sm text-brand-purple">Resumen rápido de tus solicitudes más recientes.</p>
        </div>

        {ultimos4Viajes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {ultimos4Viajes.map((viaje) => (
              <article key={viaje.id_viaje} className="rounded-2xl p-5 bg-brand-surface/50 border border-brand-purple/30 backdrop-blur-md shadow-[0_8px_30px_#8D62A510]">
                <p className="text-sm uppercase tracking-widest text-brand-purple">{viaje.estado ?? "Sin estado"}</p>
                <h3 className="mt-2 text-lg font-bold text-brand-text capitalize">{viaje.tipo_de_trabajo}</h3>
                <div className="mt-4 space-y-2 text-sm text-brand-lavender">
                  <p>Fecha: {viaje.fecha ? new Date(viaje.fecha).toLocaleDateString("es-AR") : "Sin fecha"}</p>
                  <p>Costo: ${Number(viaje.pagos?.[0]?.monto ?? 0).toLocaleString("es-AR")}</p>
                  <p>Trabajador: {viaje.driver ?? "Pendiente de asignación"}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-6 text-center bg-brand-surface/40 border border-brand-purple/30 text-brand-purple">
            Aún no hay viajes recientes.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">Todos tus viajes</h2>
          <p className="mt-1 text-sm text-brand-purple">Historial completo de los servicios realizados.</p>
        </div>

        <div className="rounded-2xl p-4 sm:p-6 bg-brand-surface/40 border border-brand-purple/30 backdrop-blur-md">
          <TablaViajes filas={viajes} />
        </div>
      </section>
    </div>
  );
}

export default async function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileData id={id} />
    </Suspense>
  );
}