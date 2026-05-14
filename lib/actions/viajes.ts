"use server";
import { deleteViaje, getViajesPaginados, getViajeById, getViajesByClienteId, createViajeConPago, getUltimos4ViajesCliente, updateEstadoViaje } from "../queries/viajes";


export async function getEstadoViaje(idViaje: number) {
 const viaja = await getViajeById(idViaje);
 return viaja?.estado;
}

export async function getViajesCliente(idCliente: number) {
 const viajes = await getViajesByClienteId(idCliente);
 return viajes;
}

export async function cancelarViaje(idViaje: number) {
  const viaje = await getViajeById(idViaje);
  await deleteViaje(idViaje);

}

export async function getViajesPaginadosCliente(idCliente: number, pagina: number = 1) {
  return await getViajesPaginados(idCliente, pagina);
}

export async function crearViajeYPago(formData: FormData){
  const id = formData.get("id") as string;
  const categoria = formData.get("categoria") as string;
  const monto = formData.get("monto") as string;
  const id_ubicacion = formData.get("id_ubicacion") as string;
      
  const result = await createViajeConPago({
    id_cliente: parseInt(id),
    tipo_de_trabajo: categoria,
    monto: parseInt(monto) || 0,
    id_ubicacion: parseInt(id_ubicacion),
  });
  

  return result;
}

export async function getUltimos4Cliente(idCliente: number) {
  return await getUltimos4ViajesCliente(idCliente);
}

export async function updateEstado(idViaje: number, estado: string) {
  await updateEstadoViaje(idViaje, estado);

}