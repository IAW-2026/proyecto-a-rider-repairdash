"use server"

import { createUbicacion, getUbicacionesByClerkID, getUbicacionById } from "../queries/ubicacion";
import { getClienteActual } from "./clientes";

export async function getUbicacionesPorCliente(idClerk: string) {
    return await getUbicacionesByClerkID(idClerk);
}

export async function crearUbicacion(formData: FormData) {
  const cliente = await getClienteActual();
  const calle = formData.get("calle") as string;
  const numero = formData.get("numero") as string;
  const ciudad = formData.get("ciudad") as string;

  if (!calle || !numero || !ciudad) {
    throw new Error("Faltan datos requeridos");
  }
  return await createUbicacion({
    id_clerk: cliente.id_clerk,
    calle,
    numero,
    ciudad,
  });
}

export async function recuperarUbicacion(id_ubicacion: number) {
  const result = await getUbicacionById(id_ubicacion);
  return result;
}
