"use client"

import { useRouter } from "next/navigation";


export default function BotonAgregarDestino({id}: {id: string}) {
    const router = useRouter();
    return (
        <button
            type="button"
            onClick={() => router.push(`/user/${id}/solicitudNuevaUbicacion`)}
            className="flex-1 py-3.5 rounded-xl font-bold text-base tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-95 bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-brand-text shadow-[0_0_16px_#F500F150]"
        >
            Agregar Destino
        </button>
    );
}