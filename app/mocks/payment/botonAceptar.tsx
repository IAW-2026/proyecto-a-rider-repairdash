"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BotonAceptarProps {
  idViaje: number;
  redirectUrl: string;
}

export default function BotonAceptar({ idViaje, redirectUrl }: BotonAceptarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<"success" | "error" | null>(null);

  const handleAceptar = async () => {
    setLoading(true);
    setResultado(null);

    try {
      const res = await fetch("/api/repairdash/statepayment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_REPAIRDASH_API_KEY ?? "",
        },
        body: JSON.stringify({ estado: "aceptado", id_viaje: idViaje }),
      });

      if (res.ok) {
        setResultado("success");
        setTimeout(() => router.push(redirectUrl), 1200);
      } else {
        setResultado("error");
      }
    } catch {
      setResultado("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        id="btn-aceptar-pago"
        onClick={handleAceptar}
        disabled={loading}
        className="
          flex items-center justify-center gap-2
          w-full rounded-xl px-6 py-3
          bg-emerald-500/10 border border-emerald-500/30
          text-sm font-semibold text-emerald-400
          transition-all
          hover:bg-emerald-500/20 hover:border-emerald-400/60 hover:text-emerald-300 hover:scale-[1.02]
          active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
        "
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
        {loading ? "Procesando..." : "Aceptar pago"}
      </button>

      {resultado === "success" && (
        <p className="text-xs text-emerald-400">✓ Pago aceptado — redirigiendo...</p>
      )}
      {resultado === "error" && (
        <p className="text-xs text-red-400">✗ Error al aceptar el pago</p>
      )}
    </div>
  );
}
