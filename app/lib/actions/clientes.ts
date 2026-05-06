"use server";

import { getClienteById, getClienteByClerkID } from "@/app/lib/queries/clientes";

export async function getClienteClerkID(clerkId: string) {
    const cliente = await getClienteByClerkID(clerkId) || null;
    return cliente;
}

export async function getClienteID(id: string) {
    const cliente = await getClienteById(parseInt(id)) || null;
    return cliente;
}
