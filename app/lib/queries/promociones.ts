import { prisma } from "@/app/lib/prisma";

// ─── READ ────────────────────────────────────────────────────────────────────

/** Obtener todas las promociones */
export async function getPromociones() {
  return prisma.promociones.findMany({
    orderBy: { id_promocion: "desc" },
    include: {
      cliente: true,
    },
  });
}

/** Obtener una promoción por ID */
export async function getPromocionById(id: number) {
  return prisma.promociones.findUnique({
    where: { id_promocion: id },
    include: {
      cliente: true,
    },
  });
}

/** Obtener promociones de un cliente */
export async function getPromocionesByClienteId(idCliente: number) {
  return prisma.promociones.findMany({
    where: { id_cliente: idCliente },
    orderBy: { id_promocion: "desc" },
  });
}

/** Buscar promoción por código de descuento */
export async function getPromocionByCodigo(codigo: string) {
  return prisma.promociones.findFirst({
    where: { codigo_descuento: codigo },
    include: {
      cliente: true,
    },
  });
}

// ─── CREATE ──────────────────────────────────────────────────────────────────

/** Crear una nueva promoción */
export async function createPromocion(data: {
  id_cliente?: number;
  codigo_descuento: string;
}) {
  return prisma.promociones.create({
    data: {
      id_cliente: data.id_cliente,
      codigo_descuento: data.codigo_descuento,
    },
  });
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

/** Actualizar una promoción */
export async function updatePromocion(
  id: number,
  data: {
    codigo_descuento?: string;
    id_cliente?: number;
  }
) {
  return prisma.promociones.update({
    where: { id_promocion: id },
    data,
  });
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

/** Eliminar una promoción por ID */
export async function deletePromocion(id: number) {
  return prisma.promociones.delete({
    where: { id_promocion: id },
  });
}

/** Eliminar todas las promociones de un cliente */
export async function deletePromocionesByCliente(idCliente: number) {
  return prisma.promociones.deleteMany({
    where: { id_cliente: idCliente },
  });
}

// ─── COUNT ───────────────────────────────────────────────────────────────────

/** Contar total de promociones */
export async function countPromociones() {
  return prisma.promociones.count();
}

/** Contar promociones de un cliente */
export async function countPromocionesByCliente(idCliente: number) {
  return prisma.promociones.count({
    where: { id_cliente: idCliente },
  });
}
