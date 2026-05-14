import BotonNuevoTrabajo from "@/app/components/BotonNuevoTrabajo";
import ViajeEnCurso from "@/app/components/viajeEnCurso";
import {getUltimos4Cliente } from "@/lib/actions/viajes";
import { Suspense } from "react";
import MenuSkeleton from "@/app/components/skeletons/MenuSkeleton";
import ActualizarEstadoViaje from "@/app/mocks/actualizarEstadoViaje";

async function MenuData({ id }: { id: string }) {
  // Obtenemos todos los viajes del cliente
  const viajes = await getUltimos4Cliente(parseInt(id));

  // Buscamos si tiene algún viaje activo (ni finalizado ni cancelado)
  const viajeActivo = viajes.find(
    (v) => v.estado && v.estado.toLowerCase() !== "concluido"
  );

  // Filtramos los viajes que ya son un historial
  const viajesPasados = viajes.filter(
    (v) => v.estado && (v.estado.toLowerCase() === "concluido")
  );

  return (
    <div className="py-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-text">
          Menú principal
        </h1>
        <p className="mt-2 text-base text-brand-purple">
          {viajeActivo ? "Seguimiento de tu servicio" : "¿Qué querés hacer hoy?"}
        </p>
      </div>

      {viajeActivo ? (
        // Renderizar el seguimiento si hay un viaje en curso
        <div className="mb-8">
          <ViajeEnCurso idViaje={viajeActivo.id_viaje} idCliente={parseInt(id)} estadoInicial={viajeActivo.estado ?? "pendiente"} />
          <ActualizarEstadoViaje id={viajeActivo.id_viaje} /> {/* ESTO ES TEMPORAL PARA SIMULAR EL PASAJE DE ESTADOS*/}
        </div>
      ) : (
        // Action card normal si no hay viaje en curso
        <div className="mb-8 rounded-2xl p-6 flex flex-col gap-4 bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-md">
          <h2 className="text-xl font-bold text-brand-lavender">Nuevo trabajo</h2>
          <p className="text-base text-brand-purple">Creá una solicitud de servicio técnico.</p>
          <BotonNuevoTrabajo id={id} />
        </div>
      )}

      {/* Recent jobs section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4 text-brand-text">Últimos trabajos</h2>
        {viajesPasados.length > 0 ? (
          <div className="flex flex-col gap-3">
            {viajesPasados.slice(0, 4).map((viaje) => (
              <div 
                key={viaje.id_viaje} 
                className="rounded-2xl p-5 bg-brand-surface/40 border border-brand-purple/30 flex justify-between items-center"
              >
                <div>
                  <p className="text-brand-text font-bold capitalize">{viaje.tipo_de_trabajo}</p>
                  <p className="text-sm text-brand-muted">{viaje.fecha ? new Date(viaje.fecha).toLocaleDateString() : "Sin fecha"}</p>
                </div>
                <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-300">
                  {viaje.estado}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-6 text-center bg-brand-surface/40 border border-brand-purple/30">
            <p className="text-base text-brand-purple">Aún no hay trabajos recientes.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function Menu({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuData id={id} />
    </Suspense>
  );
}