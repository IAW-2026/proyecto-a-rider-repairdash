import { prisma } from "../prisma";

// ─── READ ────────────────────────────────────────────────────────────────────

/** Obtener todos los clientes */
export async function getClientes() {
  return prisma.cliente.findMany({
    orderBy: { id_clerk: "asc" },
  });
}

/** Obtener un cliente por su id_clerk */
export async function getClienteByClerkID(id_clerk: string) {
  return prisma.cliente.findUnique({
    where: { id_clerk },
  });
}

/** Obtener un cliente con todas sus relaciones */
export async function getClienteConRelaciones(id_clerk: string) {
  return prisma.cliente.findUnique({
    where: { id_clerk },
    include: {
      viajes: true,
      ubicacion: true,
    },
  });
}



// ─── CREATE ──────────────────────────────────────────────────────────────────

/** Crear un nuevo cliente */
export async function createCliente(data: {
  mail: string;
  calificacion?: number;
  nombre?: string;
  apellido?: string;
  id_clerk: string;
}) {
  return prisma.cliente.create({
    data: {
      id_clerk: data.id_clerk,
      mail: data.mail,
      calificacion: data.calificacion,
      nombre: data.nombre,
      apellido: data.apellido,
    },
  });
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

export async function updateClienteByClerkID(
  id_clerk: string,
  data: {
    mail?: string;
    calificacion?: number;
    nombre?: string;
    apellido?: string;
  }
) {
  return prisma.cliente.update({
    where: { id_clerk },
    data,
  });
}

/** Actualizar la calificación de un cliente */
export async function updateCalificacionCliente(
  id_clerk: string,
  calificacion: number
) {
  return prisma.cliente.update({
    where: { id_clerk },
    data: { calificacion },
  });
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

/** Eliminar un cliente por su id_clerk */
export async function deleteCliente(id_clerk: string) {
  return prisma.cliente.delete({
    where: { id_clerk },
  });
}

// ─── COUNT ───────────────────────────────────────────────────────────────────

/** Contar total de clientes */
export async function countClientes() {
  return prisma.cliente.count();
}
