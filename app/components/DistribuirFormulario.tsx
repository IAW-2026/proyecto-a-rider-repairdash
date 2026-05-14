"use server";

import { nuevoTrabajo } from "@/lib/actions/nuevoTrabajo";
import { redirect } from "next/navigation";

export default async function DistribuirFormulario(formData: FormData): Promise<void> {
  const result = await nuevoTrabajo(formData);  
  const id_viaje = result.id_viaje;
  const id_cliente = result.id_cliente;
  redirect(`/mocks/payment?id_viaje=${id_viaje}&id_cliente=${id_cliente}`)
}