import FormularioNuevoTrabajo from "@/app/components/FormularioNuevoTrabajo";
import { getUbicacionesPorCliente } from "@/app/lib/actions/ubicacion";

export default async function SolicitudTrabajoActual({params}: {params: Promise<{id: string}>}) {
  const { id } = await params;
  const ubicaciones = await getUbicacionesPorCliente(id);
  
  return (
    <FormularioNuevoTrabajo id={id} ubicaciones={ubicaciones} />
  );
}