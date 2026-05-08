"use server"

import { crearUbicacion } from "./ubicacion";
import { redirect } from "next/navigation";
import { getUbicacionesPorCliente } from "./ubicacion";

export async function nuevaUbicacion(formData: FormData) {
  //verificar que no esta ya creada la ubicacion
  const ubicaciones = await getUbicacionesPorCliente(formData.get("id") as string);
  const calle = formData.get("calle");
  const numero = formData.get("numero");
  const ciudad = formData.get("ciudad");

  for (const ubicacion of ubicaciones) {
    if (ubicacion.calle === calle && ubicacion.numero === numero && ubicacion.ciudad === ciudad) {
      throw new Error("Esta ubicacion ya existe");
    }
  }
  await crearUbicacion(formData);
  const id = formData.get("id");
  redirect(`/user/${id}/solicitudTrabajoActual`);
}
