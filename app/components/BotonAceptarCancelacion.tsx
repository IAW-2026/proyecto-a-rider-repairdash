"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cancelarPago } from "@/lib/actions/pagos";
import { cancelarViaje } from "@/lib/actions/viajes";

export default function BotonAceptarCancelacion({
  idViaje,
}: {
  idViaje: number;
}) {
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
      className="w-full rounded-xl px-5 py-3 flex items-center justify-center gap-2 bg-rd-surface border border-rd-border-2 text-rd-text font-semibold text-sm transition-colors hover:bg-rd-elevated hover:border-rd-border-3 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-accent focus-visible:ring-offset-2 focus-visible:ring-offset-rd-bg"
    >
      {loading && (
        <Loader2 size={16} strokeWidth={2} className="animate-spin" />
      )}
      {loading ? "Limpiando…" : "Entendido"}
    </button>
  );
}
