"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

export default function BotonIrAPagar({ url }: { url: string | null }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    window.location.href = url || "https://proyecto-a-payments-repairdash.vercel.app";
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded-xl px-4 py-3 flex items-center justify-center gap-2 bg-rd-accent text-white font-semibold text-sm transition-colors hover:bg-rd-accent/90 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-accent focus-visible:ring-offset-2 focus-visible:ring-offset-rd-bg"
    >
      {loading ? (
        <Loader2 size={16} strokeWidth={2} className="animate-spin" />
      ) : (
        <CreditCard size={16} strokeWidth={1.75} />
      )}
      {loading ? "Redirigiendo…" : "Ir a pagar"}
    </button>
  );
}
