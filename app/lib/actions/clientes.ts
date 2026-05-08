"use server";

import { getClienteById, getClienteByClerkID, createCliente } from "@/app/lib/queries/clientes";

export async function getClienteClerkID(clerkId: string) {
    const cliente = await getClienteByClerkID(clerkId) || null;
    return cliente;
}

export async function getClienteID(id: string) {
    const cliente = await getClienteById(parseInt(id)) || null;
    return cliente;
}

export async function crearCliente (mail: string,calificacion: number, nombre: string, apellido: string, id_clerk: string) {
    const cliente = await createCliente({
        mail,
        calificacion,
        nombre,
        apellido,
        id_clerk
    });
    return cliente;
}