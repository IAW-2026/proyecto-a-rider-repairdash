"use server"

import { crearViajeYPago } from "./viajes";

export async function nuevoTrabajo(formData: FormData){
  return await crearViajeYPago(formData);
}
