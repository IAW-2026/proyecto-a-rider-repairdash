import FormularioNuevoTrabajo from "./_components/FormularioNuevoTrabajo";
import { getUbicacionesPorCliente } from "@/lib/actions/ubicacion";
import { Suspense } from "react";
import SolicitudTrabajoActualSkeleton from "@/app/components/skeletons/SolicitudTrabajoActualSkeleton";
import { obtenerTrabajos } from "@/lib/actions/apis/driver/obtenerTrabajos";
import { obtenerDescuentos } from "@/lib/actions/apis/promotions/obtenerDescuentos";

async function SolicitudData({
  id,
  tipoServicioIdParam,
}: {
  id: string;
  tipoServicioIdParam?: string;
}) {
  const [ubicaciones, tipos, descuentos] = await Promise.all([
    getUbicacionesPorCliente(id),
    obtenerTrabajos().catch((err) => {
      console.error("[obtenerTrabajos] fallo:", err);
      return [] as { id: string }[];
    }),
    obtenerDescuentos(id).catch((err) => {
      console.error("[obtenerDescuentos] fallo:", err);
      return [] as { id: number }[];
    }),
  ]);

  const tipoServicioIdInicial =
    tipoServicioIdParam &&
    tipos.some((t: { id: string }) => t.id === tipoServicioIdParam)
      ? tipoServicioIdParam
      : undefined;

  return (
    <FormularioNuevoTrabajo
      id={id}
      ubicaciones={ubicaciones}
      tipos={tipos}
      descuentos={descuentos}
      tipoServicioIdInicial={tipoServicioIdInicial}
    />
  );
}

export default async function SolicitudTrabajoActual({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tipoServicioId?: string }>;
}) {
  const { id } = await params;
  const { tipoServicioId } = await searchParams;

  return (
    <Suspense fallback={<SolicitudTrabajoActualSkeleton />}>
      <SolicitudData id={id} tipoServicioIdParam={tipoServicioId} />
    </Suspense>
  );
}
