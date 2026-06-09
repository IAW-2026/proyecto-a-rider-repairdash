"use server";
import {
  deleteViaje,
  getViajeById,
  createViajeConPago,
  updateEstadoViaje,
  getViajesByClerkID,
  getUltimos4ViajesPorClerkID,
  getViajesPaginadosByClerkID,
} from "../queries/viajes";
import { getClienteActual } from "./clientes";


export async function getEstadoViaje(idViaje: number) {
 const viaja = await getViajeById(idViaje);
 return viaja?.estado;
}

export async function getViajesCliente(idClerk: string) {
 const viajes = await getViajesByClerkID(idClerk);
 return viajes;
}

export async function cancelarViaje(idViaje: number) {
  const viaje = await getViajeById(idViaje);
  await deleteViaje(idViaje);

}

export async function getViajesPaginadosCliente(idClerk: string, pagina: number = 1) {
  return await getViajesPaginadosByClerkID(idClerk, pagina);
}

export async function crearViajeYPago(formData: FormData){
  const cliente = await getClienteActual();
  const categoria = formData.get("categoria") as string;
  const montoConDescuento = formData.get("montoConDescuento") as string;
  const id_ubicacion = formData.get("id_ubicacion") as string;

  const result = await createViajeConPago({
    id_clerk: cliente.id_clerk,
    tipo_de_trabajo: categoria,
    monto: parseInt(montoConDescuento) || 0,
    id_ubicacion: parseInt(id_ubicacion),
  });


  return result;
}

export async function getUltimos4Cliente(idClerk: string) {
  return await getUltimos4ViajesPorClerkID(idClerk);
}

export async function updateEstado(idViaje: number, estado: string) {
  await updateEstadoViaje(idViaje, estado);

}

export async function getDriver(idViaje: number) {
  const viaje = await getViajeById(idViaje);
  return viaje?.driver;
}
