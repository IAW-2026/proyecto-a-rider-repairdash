"use client";

import { useState } from "react";
import { toast } from "sonner";
import { XCircle, Loader2 } from "lucide-react";
import { updateEstado } from "@/lib/actions/viajes";
import { cancelacionPayment } from "@/lib/actions/apis/payment/cancelarPayment";
import { cancelarViajeADriver } from "@/lib/actions/apis/driver/cancelarViajeADriver";

export default function BotonCancelarViaje({
  idViaje,
}: {
  idViaje: number;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await cancelacionPayment(idViaje);
      await cancelarViajeADriver(idViaje);
      await updateEstado(idViaje, "cancelado");
      toast.success("Cancelación enviada", {
        description: "Confirmá la cancelación en el panel del viaje.",
      });
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-xl px-4 py-3 flex items-center justify-center gap-2 bg-rd-danger-bg border border-rd-danger/30 text-rd-danger font-semibold text-sm transition-colors hover:bg-rd-danger/20 hover:border-rd-danger/50 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-danger focus-visible:ring-offset-2 focus-visible:ring-offset-rd-bg"
    >
      {loading ? (
        <Loader2 size={16} strokeWidth={2} className="animate-spin" />
      ) : (
        <XCircle size={16} strokeWidth={1.75} />
      )}
      {loading ? "Cancelando…" : "Cancelar viaje"}
    </button>
  );
}
