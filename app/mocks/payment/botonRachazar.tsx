"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BotonRachazarProps {
  idViaje: number;
  redirectUrl: string;
}

export default function BotonRachazar({ idViaje, redirectUrl }: BotonRachazarProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<"success" | "error" | null>(null);

  const handleRachazar = async () => {
    setLoading(true);
    setResultado(null);

    try {
      const res = await fetch("/api/repairdash/statepayment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_REPAIRDASH_API_KEY ?? "",
        },
        body: JSON.stringify({ estado: "rechazado", id_viaje: idViaje }),
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
        id="btn-rachazar-pago"
        onClick={handleRachazar}
        disabled={loading}
        className="
          flex items-center justify-center gap-2
          w-full rounded-xl px-6 py-3
          bg-red-500/10 border border-red-500/30
          text-sm font-semibold text-red-400
          transition-all
          hover:bg-red-500/20 hover:border-red-400/60 hover:text-red-300 hover:scale-[1.02]
          active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
        "
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
        ) : (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {loading ? "Procesando..." : "Rechazar pago"}
      </button>

      {resultado === "success" && (
        <p className="text-xs text-[#C392DD]">✓ Pago rechazado — redirigiendo...</p>
      )}
      {resultado === "error" && (
        <p className="text-xs text-red-400">✗ Error al rechazar el pago</p>
      )}
    </div>
  );
}
