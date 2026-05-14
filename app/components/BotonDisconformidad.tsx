"use client";

import { useState } from "react";
import { updateEstado } from "@/lib/actions/viajes";
import { redirect } from "next/navigation";

interface BotonDisconformidadProps {
  idViaje: number;
  idCliente: number;
}

export default function BotonDisconformidad({ idViaje, idCliente }: BotonDisconformidadProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await updateEstado(idViaje, "concluido");
      // TODO: navegar a pantalla de feedback/reporte
    } catch (e) {
      console.error("Error al concluir viaje (disconformidad):", e);
    } finally {
      setLoading(false);
    }
    redirect (`/mocks/feedback?id_cliente=${idCliente}`)
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-2xl p-6 flex items-center justify-center gap-3
                   bg-red-500/10 border border-red-500/30
                   text-red-400 font-semibold text-base
                   transition-all hover:bg-red-500/20 hover:border-red-400/60
                   active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        )}
        {loading ? "Procesando..." : "Reportar problema"}
      </button>
    </div>
  );
  // luego avisar disconformidad al driver
  // debe ir a feedback para poder elaborar un reporte
}