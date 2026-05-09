
"use server"

import { createUbicacion, getUbicacionesByClienteId } from "../queries/ubicacion";

export async function getUbicacionesPorCliente(idCliente: string) {
    return await getUbicacionesByClienteId(Number(idCliente));
}

export async function crearUbicacion(formData: FormData) {
  const idCliente = Number(formData.get("id"));
  const calle = formData.get("calle") as string;
  const numero = formData.get("numero") as string;
  const ciudad = formData.get("ciudad") as string;

  if (!idCliente || !calle || !numero || !ciudad) {
    throw new Error("Faltan datos requeridos");
  }
  return await createUbicacion({
    id_cliente: idCliente,
    calle,
    numero,
    ciudad,
  });

}