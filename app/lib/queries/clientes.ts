import { prisma } from "@/app/lib/prisma";

// ─── READ ────────────────────────────────────────────────────────────────────

/** Obtener todos los clientes */
export async function getClientes() {
  return prisma.cliente.findMany({
    orderBy: { id_cliente: "asc" },
  });
}

/** Obtener un cliente por ID */
export async function getClienteById(id: number) {
  return prisma.cliente.findUnique({
    where: { id_cliente: id },
  });
}

/** Obtener un cliente por mail */
export async function getClienteByClerkID(id_clerk: string) {
  return prisma.cliente.findUnique({
    where: { id_clerk },
  });
}

/** Obtener un cliente con todas sus relaciones */
export async function getClienteConRelaciones(id: number) {
  return prisma.cliente.findUnique({
    where: { id_cliente: id },
    include: {
      viajes: true,
      ubicacion: true,
      promociones: true,
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
  id_clerk?: string;
}) {
  return prisma.cliente.create({
    data: {
      mail: data.mail,
      calificacion: data.calificacion,
      nombre: data.nombre,
      apellido: data.apellido,
      id_clerk: data.id_clerk,
    },
  });
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

/** Actualizar un cliente */
export async function updateCliente(
  id: number,
  data: {
    mail?: string;
    calificacion?: number;
    nombre?: string;
    apellido?: string;
  }
) {
  return prisma.cliente.update({
    where: { id_cliente: id },
    data,
  });
}
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
  id: number,
  calificacion: number
) {
  return prisma.cliente.update({
    where: { id_cliente: id },
    data: { calificacion },
  });
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

/** Eliminar un cliente por ID */
export async function deleteCliente(id: number) {
  return prisma.cliente.delete({
    where: { id_cliente: id },
  });
}

// ─── COUNT ───────────────────────────────────────────────────────────────────

/** Contar total de clientes */
export async function countClientes() {
  return prisma.cliente.count();
}
