import TablaViajes from "@/app/components/TablaViajes";
import { getViajesPaginadosCliente } from "@/lib/actions/viajes";
import Link from "next/link";
import { Suspense } from "react";
import TravelsSkeleton from "@/app/components/skeletons/TravelsSkeleton";

async function TravelsData({ id, page }: { id: string, page?: string }) {
  const paginaActual = Number(page) || 1;
  const { viajes, totalPaginas } = await getViajesPaginadosCliente(Number(id), paginaActual);

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-text">
          Trabajos realizados
        </h1>
        <p className="mt-2 text-base text-brand-purple">
          Historial de todos tus servicios técnicos.
        </p>
      </div>
      <div className="min-h-[700px]">
        <TablaViajes filas={viajes} />
      </div>

      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          {paginaActual > 1 ? (
            <Link
              href={`/user/${id}/travels?page=${paginaActual - 1}`}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 bg-brand-surface/60 border border-brand-purple/40 text-brand-lavender hover:border-brand-accent hover:text-brand-text"
            >
              ← Anterior
            </Link>
          ) : (
            <span className="px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-surface/20 border border-brand-purple/20 text-brand-purple/30 cursor-not-allowed">
              ← Anterior
            </span>
          )}

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <Link
              key={num}
              href={`/user/${id}/travels?page=${num}`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 hover:scale-105 ${
                num === paginaActual
                  ? "bg-brand-accent text-white shadow-[0_0_16px_#F500F150]"
                  : "bg-brand-surface/40 border border-brand-purple/30 text-brand-lavender hover:border-brand-accent"
              }`}
            >
              {num}
            </Link>
          ))}

          {paginaActual < totalPaginas ? (
            <Link
              href={`/user/${id}/travels?page=${paginaActual + 1}`}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 bg-brand-surface/60 border border-brand-purple/40 text-brand-lavender hover:border-brand-accent hover:text-brand-text"
            >
              Siguiente →
            </Link>
          ) : (
            <span className="px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-surface/20 border border-brand-purple/20 text-brand-purple/30 cursor-not-allowed">
              Siguiente →
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default async function Travels({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string }>;}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  
  return (
    <Suspense fallback={<TravelsSkeleton />}>
      <TravelsData id={id} page={resolvedSearchParams.page} />
    </Suspense>
  );
}