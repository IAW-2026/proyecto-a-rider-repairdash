"use server";

import { deleteViaje, getViajesPaginados, getViajeById, getViajesByClienteId } from "@/app/lib/queries/viajes";

export async function getEstadoViaje(idViaje: number) {
 const viaja = await getViajeById(idViaje);
 return viaja?.estado;
}

export async function getViajesCliente(idCliente: number) {
 const viajes = await getViajesByClienteId(idCliente);
 return viajes;
}

export async function cancelarViaje(idViaje: number) {
  await deleteViaje(idViaje);
}

export async function getViajesPaginadosCliente(idCliente: number, pagina: number = 1) {
  return await getViajesPaginados(idCliente, pagina);
}



