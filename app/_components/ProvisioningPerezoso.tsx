"use client"

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { getClienteClerkID, crearCliente } from "@/lib/actions/clientes";

/**
 * Componente invisible de Lazy Provisioning.
 * Se ejecuta automáticamente tras cada sign-in o sign-up.
 * Verifica si el usuario autenticado existe en la BD y lo crea si no está.
 * No renderiza nada en pantalla — se incluye en layouts o páginas protegidas.
 */
export default function ProvisioningPerezoso() {
    const { userId, isLoaded } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        if (!isLoaded || !userId || !user) return;

        const provisionarUsuario = async () => {
            const cliente = await getClienteClerkID(userId);

            const rol = (user.publicMetadata as { role?: string })?.role;
            const esRiderOSinRol =
                !rol || rol === "rider" || rol === "admin-rider";

            if (!cliente && esRiderOSinRol) {
                await crearCliente(
                    user.primaryEmailAddress?.emailAddress ?? "",
                    0,
                    user.firstName ?? "",
                    user.lastName ?? "",
                    userId
                );
                console.log(`[Lazy] Usuario creado en BD: ${userId}`);
                await user.reload();
            }
        };

        provisionarUsuario();
    }, [isLoaded, userId, user]);

    return null;
}
