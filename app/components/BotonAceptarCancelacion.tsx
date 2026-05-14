"use client";

import { useState } from "react";
import { cancelarPago } from "@/lib/actions/pagos";
import { cancelarViaje } from "@/lib/actions/viajes";

export default function BotonAceptarCancelacion({ idViaje }: { idViaje: number }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await cancelarViaje(idViaje);
      await cancelarPago(idViaje);
    } catch (e) {
      console.error("Error al limpiar datos tras cancelación:", e);
    } finally {
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-2xl px-6 py-4 flex items-center justify-center gap-3
                 bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-md
                 text-brand-text font-semibold text-base
                 transition-all hover:bg-brand-surface hover:border-brand-purple
                 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-lavender border-t-transparent" />
      ) : null}
      {loading ? "Limpiando..." : "Entendido"}
    </button>
  );
}