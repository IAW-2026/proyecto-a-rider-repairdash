import FormularioNuevoTrabajo from "@/app/components/FormularioNuevoTrabajo";
import { getUbicacionesPorCliente } from "@/app/lib/actions/ubicacion";
import { Suspense } from "react";
import SolicitudTrabajoActualSkeleton from "@/app/components/skeletons/SolicitudTrabajoActualSkeleton";

async function SolicitudData({ id }: { id: string }) {
  const ubicaciones = await getUbicacionesPorCliente(id);
  return <FormularioNuevoTrabajo id={id} ubicaciones={ubicaciones} />;
}

export default async function SolicitudTrabajoActual({params}: {params: Promise<{id: string}>}) {
  const { id } = await params;
  return (
    <Suspense fallback={<SolicitudTrabajoActualSkeleton />}>
      <SolicitudData id={id} />
    </Suspense>
  );
}