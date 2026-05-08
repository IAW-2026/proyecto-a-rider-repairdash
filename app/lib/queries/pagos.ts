import { prisma } from "@/app/lib/prisma";

// ─── READ ────────────────────────────────────────────────────────────────────

/** Obtener todos los pagos */
export async function getPagos() {
  return prisma.pagos.findMany({
    orderBy: { id_pago: "desc" },
    include: {
      viajes: true,
    },
  });
}

/** Obtener un pago por ID */
export async function getPagoById(id: number) {
  return prisma.pagos.findUnique({
    where: { id_pago: id },
    include: {
      viajes: true,
    },
  });
}

/** Obtener todos los pagos de un viaje */
export async function getPagosByViajeId(idViaje: number) {
  return prisma.pagos.findMany({
    where: { id_viaje: idViaje },
    orderBy: { id_pago: "desc" },
  });
}

/** Obtener los pagos de un cliente (a través de viajes) */
export async function getPagosByClienteId(idCliente: number) {
  return prisma.pagos.findMany({
    where: {
      viajes: {
        id_cliente: idCliente,
      },
    },
    orderBy: { id_pago: "desc" },
    include: {
      viajes: true,
    },
  });
}

// ─── CREATE ──────────────────────────────────────────────────────────────────

/** Crear un nuevo pago */
export async function createPago(data: {
  id_viaje?: number;
  monto: number;
}) {
  return prisma.pagos.create({
    data: {
      viajes: data.id_viaje ? { connect: { id_viaje: data.id_viaje } } : undefined,
      monto: data.monto,
      estado: "pendiente",
    },
  });
}

// ─── UPDATE ──────────────────────────────────────────────────────────────────

/** Actualizar un pago */
export async function updatePago(
  id: number,
  data: {
    monto?: number;
    id_viaje?: number;
  }
) {
  return prisma.pagos.update({
    where: { id_pago: id },
    data,
  });
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

/** Eliminar un pago por ID */
export async function deletePago(id: number) {
  return prisma.pagos.delete({
    where: { id_pago: id },
  });
}

