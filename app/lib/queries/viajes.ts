import { prisma } from "@/app/lib/prisma";

// ─── READ ────────────────────────────────────────────────────────────────────

/** Obtener todos los viajes */
export async function getViajes() {
  return prisma.viajes.findMany({
    orderBy: { fecha: "desc" },
    include: {
      cliente: true,
      pagos: true,
    },
  });
}

/** Obtener un viaje por ID */
export async function getViajeById(id: number) {
  return prisma.viajes.findUnique({
    where: { id_viaje: id },
    include: {
      cliente: true,
      pagos: true,
    },
  });
}

/** Obtener todos los viajes de un cliente */
export async function getViajesByClienteId(idCliente: number) {
  return prisma.viajes.findMany({
    where: { id_cliente: idCliente },
    orderBy: { fecha: "desc" },
    include: {
      pagos: true,
    },
  });
}

/** Obtener viajes por estado (Pendiente, Completado, etc.) */
export async function getViajesByEstado(estado: string) {
  return prisma.viajes.findMany({
    where: { estado },
    orderBy: { fecha: "desc" },
    include: {
      cliente: true,
      pagos: true,
    },
  });
}

/** Obtener viajes por tipo de trabajo */
export async function getViajesByTipoTrabajo(tipoDeTrabajo: string) {
  return prisma.viajes.findMany({
    where: {
      tipo_de_trabajo: { contains: tipoDeTrabajo },
    },
    orderBy: { fecha: "desc" },
    include: {
      cliente: true,
    },
  });
}

/** Obtener viajes por driver */
export async function getViajesByDriver(driver: string) {
  return prisma.viajes.findMany({
    where: { driver },
    orderBy: { fecha: "desc" },
    include: {
      cliente: true,
      pagos: true,
    },
  });
}

/** Obtener viajes en un rango de fechas */
export async function getViajesByFechaRango(desde: Date, hasta: Date) {
  return prisma.viajes.findMany({
    where: {
      fecha: {
        gte: desde,
        lte: hasta,
      },
    },
    orderBy: { fecha: "desc" },
    include: {
      cliente: true,
      pagos: true,
    },
  });
}

/*Obtener ultimos 4 viajes de un cliente */
export async function getUltimos4ViajesCliente(idCliente: number) {
  return prisma.viajes.findMany({
    where: { id_cliente: idCliente },
    orderBy: { fecha: "desc" },
    take: 4,
    include: {
      pagos: true,
    },
  });
}


/** Obtener viajes paginados de un cliente (10 por página) */
export async function getViajesPaginados(id_cliente: number, pagina: number = 1) {
  const porPagina = 10;
  const skip = (pagina - 1) * porPagina;

  const [viajes, total] = await Promise.all([
    prisma.viajes.findMany({
      where: { id_cliente },
      orderBy: { fecha: "desc" },
      skip,
      take: porPagina,
      include: { pagos: true },
    }),
    prisma.viajes.count({ where: { id_cliente } }),
  ]);

  return {
    viajes,
    total,
    totalPaginas: Math.ceil(total / porPagina),
    paginaActual: pagina,
  };
}
// ─── CREATE ──────────────────────────────────────────────────────────────────

/** Crear un nuevo viaje */
export async function createViaje(data: {
  id_cliente?: number;
  tipo_de_trabajo: string;
  driver?: string;
  estado?: string;
  id_ubicacion?: number;
}) {
  return prisma.viajes.create({
    data: {
      id_cliente: data.id_cliente,
      tipo_de_trabajo: data.tipo_de_trabajo,
      driver: data.driver,
      estado: data.estado ?? "pendiente",
      id_ubicacion: data.id_ubicacion,
    },
  });
}

/** Crear un nuevo viaje junto con su pago asociado de forma atómica */
export async function createViajeConPago(data: {
  id_cliente: number;
  tipo_de_trabajo: string;
  monto: number;
  id_ubicacion: number;
}) {
  return prisma.viajes.create({
    data: {
      id_cliente: data.id_cliente,
      tipo_de_trabajo: data.tipo_de_trabajo,
      estado: "pendiente",
      id_ubicacion: data.id_ubicacion,
      pagos: {
        create: [
          {
            monto: data.monto,
            estado: "pendiente"
          }
        ]
      }
    },
    include: {
      pagos: true
    }
  });
}



// ─── UPDATE ──────────────────────────────────────────────────────────────────

/** Actualizar el estado de un viaje */
export async function updateEstadoViaje(id: number, estado: string) {
  return prisma.viajes.update({
    where: { id_viaje: id },
    data: { estado },
  });
}

/** Asignar un driver a un viaje */
export async function asignarDriverViaje(id: number, driver: string) {
  return prisma.viajes.update({
    where: { id_viaje: id },
    data: { driver },
  });
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

/** Eliminar un viaje por ID */
export async function deleteViaje(id: number) {
  return prisma.viajes.delete({
    where: { id_viaje: id },
  });
}

// ─── COUNT ───────────────────────────────────────────────────────────────────

/** Contar total de viajes */
export async function countViajes() {
  return prisma.viajes.count();
}

/** Contar viajes por estado */
export async function countViajesByEstado(estado: string) {
  return prisma.viajes.count({
    where: { estado },
  });
}

/** Contar viajes de un cliente */
export async function countViajesByCliente(idCliente: number) {
  return prisma.viajes.count({
    where: { id_cliente: idCliente },
  });
}


