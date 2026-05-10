import { prisma } from "../prisma";

// ─── READ ────────────────────────────────────────────────────────────────────

/** Obtener todas las ubicaciones */
export async function getUbicaciones() {
  return prisma.ubicacion.findMany({
    orderBy: { id_ubicacion: "asc" },
    include: {
      cliente: true,
    },
  });
}

/** Obtener una ubicación por ID */
export async function getUbicacionById(id: number) {
  return prisma.ubicacion.findUnique({
    where: { id_ubicacion: id },
    include: {
      cliente: true,
    },
  });
}

/** Obtener ubicaciones de un cliente */
export async function getUbicacionesByClienteId(idCliente: number) {
  return prisma.ubicacion.findMany({
    where: { id_cliente: idCliente },
    orderBy: { id_ubicacion: "asc" },
  });
}

/** Buscar ubicaciones por ciudad */
export async function getUbicacionesByCiudad(ciudad: string) {
  return prisma.ubicacion.findMany({
    where: {
      ciudad: { contains: ciudad },
    },
    include: {
      cliente: true,
    },
  });
}

/** Buscar ubicaciones por calle */
export async function getUbicacionesByCalle(calle: string) {
  return prisma.ubicacion.findMany({
    where: {
      calle: { contains: calle },
    },
    include: {
      cliente: true,
    },
  });
}

// ─── CREATE ──────────────────────────────────────────────────────────────────

/** Crear una nueva ubicación */
export async function createUbicacion(data: {
  id_cliente?: number;
  calle: string;
  numero: string;
  ciudad: string;
}) {
  return prisma.ubicacion.create({
    data: {
      id_cliente: data.id_cliente,
      calle: data.calle,
      numero: data.numero,
      ciudad: data.ciudad,
    },
  });
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

/** Actualizar una ubicación */
export async function updateUbicacion(
  id: number,
  data: {
    calle?: string;
    numero?: string;
    ciudad?: string;
    id_cliente?: number;
  }
) {
  return prisma.ubicacion.update({
    where: { id_ubicacion: id },
    data,
  });
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

/** Eliminar una ubicación por ID */
export async function deleteUbicacion(id: number) {
  return prisma.ubicacion.delete({
    where: { id_ubicacion: id },
  });
}

/** Eliminar todas las ubicaciones de un cliente */
export async function deleteUbicacionesByCliente(idCliente: number) {
  return prisma.ubicacion.deleteMany({
    where: { id_cliente: idCliente },
  });
}

// ─── COUNT ───────────────────────────────────────────────────────────────────

/** Contar total de ubicaciones */
export async function countUbicaciones() {
  return prisma.ubicacion.count();
}

/** Contar ubicaciones de un cliente */
export async function countUbicacionesByCliente(idCliente: number) {
  return prisma.ubicacion.count({
    where: { id_cliente: idCliente },
  });
}
