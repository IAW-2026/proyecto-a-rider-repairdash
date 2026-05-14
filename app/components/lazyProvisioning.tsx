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
export default function Lazy() {
    const { userId, isLoaded } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        // Esperamos a que Clerk termine de cargar y haya un usuario activo
        if (!isLoaded || !userId || !user) return;

        const provisionarUsuario = async () => {
            // Verificamos si ya existe en nuestra BD
            const cliente = await getClienteClerkID(userId);

            // Si no existe, lo creamos con sus datos de Clerk
            if (!cliente) {
                await crearCliente(
                    user.primaryEmailAddress?.emailAddress ?? "",
                    0,
                    user.firstName ?? "",
                    user.lastName ?? "",
                    userId
                );
                console.log(`[Lazy] Usuario creado en BD: ${userId}`);
                // Refrescamos el objeto de sesión para que Clerk actualice
                // el publicMetadata (rol) en el cliente sin recargar la página
                await user.reload();
            }
        };

        provisionarUsuario();
    }, [isLoaded, userId, user]); // Se ejecuta cuando cambia el estado de sesión

    return null; // Componente invisible, solo lógica
}