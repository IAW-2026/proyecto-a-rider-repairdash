"use server";

import { 
    getClienteById, 
    getClienteByClerkID, 
    createCliente, 
    getClientes, 
    deleteCliente, 
    updateCliente 
} from "../queries/clientes";
import { clerkClient } from "@clerk/nextjs/server";

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
 * Ahora filtra para mostrar solo aquellos que tengan el rol de "cliente" en Clerk.
 */
export async function obtenerTodosLosClientes() {
    // 1. Obtenemos todos los registros de la base de datos
    const clientesDB = await getClientes();
    
    // 2. Obtenemos la lista de usuarios de Clerk para verificar roles
    const c = await clerkClient();
    const usuariosClerk = await c.users.getUserList({
        limit: 500, // Ajustar según necesidad
    });

    // 3. Filtramos y unimos la información
    // Solo incluimos a los que tienen rol "cliente" o los que no tienen ID de Clerk aún (pendientes de login)
    // Pero la petición pide explícitamente "rol de cliente"
    const clientesFiltrados = clientesDB.filter(clienteDB => {
        const usuarioClerk = usuariosClerk.data.find(u => u.id === clienteDB.id_clerk);
        
        // Si no tiene usuario en Clerk, asumimos que es cliente (o está en limbo)
        if (!usuarioClerk) return true; 

        // Si tiene usuario en Clerk, verificamos que su rol sea "cliente"
        const rol = (usuarioClerk.publicMetadata as any)?.rol;
        return rol === "cliente";
    });

    return clientesFiltrados.map(serializeCliente);
}

/** Obtener un cliente por su ID de Clerk */
export async function getClienteClerkID(clerkId: string) {
    const cliente = await getClienteByClerkID(clerkId);
    return cliente ? serializeCliente(cliente) : null;
}

/** Obtener un cliente por su ID interno */
export async function getClienteID(id: string) {
    const cliente = await getClienteById(parseInt(id));
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
    await c.users.updateUser(id_clerk, { publicMetadata: { rol: "rider" } });
    return serializeCliente(cliente);
}

/** Eliminar un cliente de Prisma y de Clerk */
export async function eliminarClienteCompleto(id_cliente: number, id_clerk?: string | null) {
    // 1. Borrar de Prisma
    await deleteCliente(id_cliente);

    // 2. Borrar de Clerk
    if (id_clerk) {
        try {
            const c = await clerkClient();
            await c.users.deleteUser(id_clerk);
        } catch (error) {
            console.error("Error al eliminar usuario de Clerk:", error);
        }
    }
    
}

/** Actualizar información básica de un cliente */
export async function actualizarClienteAction(id: number, data: {
    nombre?: string;
    apellido?: string;
    mail?: string;
    calificacion?: number;
}) {
    const updated = await updateCliente(id, data);
    return serializeCliente(updated);
}