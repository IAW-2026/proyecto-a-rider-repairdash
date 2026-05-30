"use server";

import {
    getClienteByClerkID,
    createCliente,
    getClientes,
    deleteCliente,
    updateClienteByClerkID,
} from "../queries/clientes";
import { clerkClient } from "@clerk/nextjs/server";

import { auth } from "@clerk/nextjs/server";

export async function getClienteActual() {
  const { userId } = await auth();
  if (!userId) throw new Error("No autenticado");
  const cliente = await getClienteByClerkID(userId);
  if (!cliente) throw new Error("Cliente no encontrado");
  return cliente;
}

// Helper: convierte el Decimal de Prisma a un number plano serializable
function serializeCliente(cliente: any) {
    if (!cliente) return null;
    return {
        ...cliente,
        calificacion: cliente.calificacion !== null ? Number(cliente.calificacion) : null,
    };
}

/**
 * Obtener todos los clientes (para el admin)
 * Filtra para mostrar solo aquellos que tengan el rol de "rider" en Clerk.
 */
export async function obtenerTodosLosClientes() {
    const clientesDB = await getClientes();

    const c = await clerkClient();
    const usuariosClerk = await c.users.getUserList({
        limit: 500,
    });

    const clientesFiltrados = clientesDB.filter(clienteDB => {
        const usuarioClerk = usuariosClerk.data.find(u => u.id === clienteDB.id_clerk);
        if (!usuarioClerk) return true;
        const rol = (usuarioClerk.publicMetadata as any)?.role;
        return rol === "rider";
    });

    return clientesFiltrados.map(serializeCliente);
}

/** Obtener un cliente por su ID de Clerk */
export async function getClienteClerkID(clerkId: string) {
    const cliente = await getClienteByClerkID(clerkId);
    return cliente ? serializeCliente(cliente) : null;
}

/** Crear un cliente y asignarle el rol en Clerk */
export async function crearCliente(mail: string, calificacion: number, nombre: string, apellido: string, id_clerk: string) {
    const cliente = await createCliente({
        mail,
        calificacion,
        nombre,
        apellido,
        id_clerk
    });
    const c = await clerkClient();
    const usuario = await c.users.getUser(id_clerk);
    const rolActual = (usuario.publicMetadata as { role?: string })?.role;
    // Solo asignamos "rider" si el usuario no tiene ya un rol (no pisamos el de un driver).
    if (!rolActual) {
        await c.users.updateUser(id_clerk, { publicMetadata: { role: "rider" } });
    }
    return serializeCliente(cliente);
}

/** Eliminar un cliente por su id_clerk */
export async function eliminarClienteCompleto(id_clerk: string) {
    await deleteCliente(id_clerk);
}

/** Actualizar información básica de un cliente */
export async function actualizarClienteAction(id_clerk: string, data: {
    nombre?: string;
    apellido?: string;
    mail?: string;
    calificacion?: number;
}) {
    const updated = await updateClienteByClerkID(id_clerk, data);
    return serializeCliente(updated);
}
