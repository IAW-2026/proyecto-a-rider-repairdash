"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { updateEstado } from "@/lib/actions/viajes";

interface BotonDisconformidadProps {
  idViaje: number;
  idClerk: string;
}

export default function BotonDisconformidad({
  idViaje,
  idClerk,
}: BotonDisconformidadProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await updateEstado(idViaje, "concluido");
    } catch (e) {
      console.error("Error al concluir viaje (disconformidad):", e);
    } finally {
      setLoading(false);
    }
    redirect(`/mocks/feedback?id_clerk=${idClerk}`);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-xl px-5 py-3 flex items-center justify-center gap-2 bg-rd-surface border border-rd-border-2 text-rd-text-2 font-semibold text-sm transition-colors hover:border-rd-border-3 hover:bg-rd-elevated disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-accent focus-visible:ring-offset-2 focus-visible:ring-offset-rd-bg"
    >
      {loading ? (
        <Loader2 size={16} strokeWidth={2} className="animate-spin" />
      ) : (
        <AlertTriangle size={16} strokeWidth={1.75} />
      )}
      {loading ? "Procesando…" : "Hubo un problema"}
    </button>
  );
}
