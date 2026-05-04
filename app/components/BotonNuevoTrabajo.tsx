"use client"

import { useRouter } from "next/navigation";

export default function BotonNuevoTrabajo({ id }: { id: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/user/${id}/solicitudTrabajoActual`)}
      className="px-8 py-3.5 rounded-xl font-bold text-base tracking-wide transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center gap-2 bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-brand-text shadow-[0_0_16px_#F500F150]"
    >
      <span>+</span>
      Nuevo Trabajo
    </button>
  );
}
