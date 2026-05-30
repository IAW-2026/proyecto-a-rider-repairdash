import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import TablaViajes from "../_components/TablaViajes";
import TravelsSkeleton from "@/app/components/skeletons/TravelsSkeleton";
import { getViajesPaginadosCliente } from "@/lib/actions/viajes";
import { PageHeader, Button, cn } from "@/app/components/ui";

async function TravelsData({ id, page }: { id: string; page?: string }) {
  const paginaActual = Number(page) || 1;
  const { viajes, totalPaginas } = await getViajesPaginadosCliente(
    id,
    paginaActual,
  );

  return (
    <>
      <div className="min-h-[400px]">
        <TablaViajes filas={viajes} />
      </div>

      {totalPaginas > 1 && (
        <nav
          className="flex items-center justify-center gap-1.5 mt-6"
          aria-label="Paginación"
        >
          {paginaActual > 1 ? (
            <Link
              href={`/user/${id}/travels?page=${paginaActual - 1}`}
              className="inline-flex items-center gap-1 px-3 h-9 rounded-lg text-xs font-semibold bg-rd-surface border border-rd-border-2 text-rd-text-2 hover:bg-rd-elevated hover:border-rd-border-3 transition-colors"
            >
              <ChevronLeft size={14} strokeWidth={1.75} />
              Anterior
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 h-9 rounded-lg text-xs font-semibold bg-rd-surface/40 border border-rd-border text-rd-subtle cursor-not-allowed">
              <ChevronLeft size={14} strokeWidth={1.75} />
              Anterior
            </span>
          )}

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <Link
              key={num}
              href={`/user/${id}/travels?page=${num}`}
              className={cn(
                "w-9 h-9 inline-flex items-center justify-center rounded-lg text-xs font-semibold transition-colors",
                num === paginaActual
                  ? "bg-rd-accent text-white"
                  : "bg-rd-surface border border-rd-border-2 text-rd-text-2 hover:bg-rd-elevated hover:border-rd-border-3",
              )}
              aria-current={num === paginaActual ? "page" : undefined}
            >
              {num}
            </Link>
          ))}

          {paginaActual < totalPaginas ? (
            <Link
              href={`/user/${id}/travels?page=${paginaActual + 1}`}
              className="inline-flex items-center gap-1 px-3 h-9 rounded-lg text-xs font-semibold bg-rd-surface border border-rd-border-2 text-rd-text-2 hover:bg-rd-elevated hover:border-rd-border-3 transition-colors"
            >
              Siguiente
              <ChevronRight size={14} strokeWidth={1.75} />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 h-9 rounded-lg text-xs font-semibold bg-rd-surface/40 border border-rd-border text-rd-subtle cursor-not-allowed">
              Siguiente
              <ChevronRight size={14} strokeWidth={1.75} />
            </span>
          )}
        </nav>
      )}
    </>
  );
}

export default async function Travels({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const resolved = await searchParams;
  return (
    <div className="py-2 sm:py-4 max-w-6xl mx-auto w-full">
      <PageHeader
        eyebrow="Cliente · Historial"
        size="large"
        title="Trabajos realizados"
        description="Historial completo de tus servicios técnicos."
        actions={
          <Button href={`/user/${id}/solicitudTrabajoActual`}>
            <Plus size={15} strokeWidth={1.75} />
            Nuevo trabajo
          </Button>
        }
      />
      <Suspense fallback={<TravelsSkeleton />}>
        <TravelsData id={id} page={resolved.page} />
      </Suspense>
    </div>
  );
}
