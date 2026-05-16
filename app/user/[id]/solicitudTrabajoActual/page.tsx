import FormularioNuevoTrabajo from "@/app/components/FormularioNuevoTrabajo";
import { getUbicacionesPorCliente } from "@/lib/actions/ubicacion";
import { Suspense } from "react";
import SolicitudTrabajoActualSkeleton from "@/app/components/skeletons/SolicitudTrabajoActualSkeleton";
import { PRECIOS } from "@/lib/services/pricing";

const CATEGORIAS_VALIDAS = new Set(Object.keys(PRECIOS));

async function SolicitudData({
  id,
  categoriaInicial,
}: {
  id: string;
  categoriaInicial?: string;
}) {
  const ubicaciones = await getUbicacionesPorCliente(id);
  return (
    <FormularioNuevoTrabajo
      id={id}
      ubicaciones={ubicaciones}
      categoriaInicial={categoriaInicial}
    />
  );
}

export default async function SolicitudTrabajoActual({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { id } = await params;
  const { categoria } = await searchParams;
  const categoriaInicial =
    categoria && CATEGORIAS_VALIDAS.has(categoria) ? categoria : undefined;

  return (
    <Suspense fallback={<SolicitudTrabajoActualSkeleton />}>
      <SolicitudData id={id} categoriaInicial={categoriaInicial} />
    </Suspense>
  );
}
