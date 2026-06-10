"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
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
      window.location.href = "https://proyecto-a-feedback-repairdash.vercel.app";
    } catch (e) {
      console.error("Error al concluir viaje:", e);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-xl px-5 py-3.5 flex items-center justify-center gap-2 bg-rd-ok text-[#0d2419] font-semibold text-[15px] transition-colors hover:bg-rd-ok/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-ok focus-visible:ring-offset-2 focus-visible:ring-offset-rd-bg"
    >
      {loading ? (
        <Loader2 size={16} strokeWidth={2} className="animate-spin" />
      ) : (
        <Check size={16} strokeWidth={2} />
      )}
      {loading ? "Procesando…" : "Confirmar conformidad"}
    </button>
  );
}
