"use server";

import { getClienteById, getClienteByClerkID, createCliente } from "@/app/lib/queries/clientes";

// Helper: convierte el Decimal de Prisma a un number plano serializable
function serializeCliente(cliente: NonNullable<Awaited<ReturnType<typeof getClienteByClerkID>>>) {
    return {
        ...cliente,
        calificacion: cliente.calificacion !== null ? Number(cliente.calificacion) : null,
    };
}

export async function getClienteClerkID(clerkId: string) {
    const cliente = await getClienteByClerkID(clerkId);
    return cliente ? serializeCliente(cliente) : null;
}

export async function getClienteID(id: string) {
    const cliente = await getClienteById(parseInt(id));
    return cliente ? serializeCliente(cliente) : null;
}

export async function crearCliente(mail: string, calificacion: number, nombre: string, apellido: string, id_clerk: string) {
    const cliente = await createCliente({
        mail,
        calificacion,
        nombre,
        apellido,
        id_clerk
    });
    return serializeCliente(cliente);
}