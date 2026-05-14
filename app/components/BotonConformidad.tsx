"use client";

import { useState } from "react";
import { updateEstado } from "@/lib/actions/viajes";

interface BotonConformidadProps {
  idViaje: number;
}

export default function BotonConformidad({ idViaje }: BotonConformidadProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await updateEstado(idViaje, "concluido");
      window.location.reload();
    } catch (e) {
      console.error("Error al concluir viaje:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-2xl p-6 flex items-center justify-center gap-3
                   bg-emerald-500/10 border border-emerald-500/30
                   text-emerald-400 font-semibold text-base
                   transition-all hover:bg-emerald-500/20 hover:border-emerald-400/60
                   active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
        {loading ? "Procesando..." : "Acepto el servicio"}
      </button>
    </div>
  );
  // luego avisar conformidad al driver
}