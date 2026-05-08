"use client"

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getClienteClerkID } from "../lib/actions/clientes";

export default function BotonIrAlMenu() {
    const router = useRouter();
    const { userId } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        if (!userId) return;
        setIsLoading(true);
        
        const id = await getClienteClerkID(userId);
        if (id?.id_cliente) {
            router.push(`/user/${id.id_cliente}/menu`);
        } else {
            // Si no se encontró el usuario, dejamos de cargar
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-white rounded-full font-bold text-xl h-16 px-12 shadow-[0_0_20px_#F500F160] transition-transform hover:scale-105 active:scale-95 flex items-center justify-center min-w-[200px] ${isLoading ? "opacity-70 cursor-wait" : ""}`}
        >
            {isLoading ? "Cargando..." : "Ir al menu"}
        </button>
    );
}