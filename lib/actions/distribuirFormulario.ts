"use server";

import { nuevoTrabajo } from "@/lib/actions/nuevoTrabajo";
//import { put } from "@vercel/blob";
import { redirect } from "next/navigation";
//import { recuperarUbicacion } from "./ubicacion";
//import realizarFetchDriver from "./apis/driver/realizarFetchDriver";

export async function distribuirFormulario(formData: FormData): Promise<void> {
  const result = await nuevoTrabajo(formData);


 /* const id_trabajo = String (result?.id_viaje);
  // proximamente se hara los fetch a driverApp y feedbackApp

  const id = formData.get("id") as string;
  const categoria = formData.get("categoria") as string;
  const monto = formData.get("monto") as string;
  const id_ubicacion = formData.get("id_ubicacion") as string;
  const fotos = formData.getAll("foto") as File[];
  const descripcion = formData.get("descripcion") as string;

  // Sube cada foto a Vercel Blob y obtiene su URL HTTPS publica.
  const urlsFotos = await Promise.all(
    fotos.map(async (foto) => {
      const blob = await put(`trabajos/${id}/${foto.name}`, foto, {
        access: "public",
        addRandomSuffix: true,
      });
      return blob.url;
    })
  );

  const ubicacion = await recuperarUbicacion(Number(id_ubicacion));
  const calle = ubicacion?.calle || "desconocida";
  const numero = ubicacion?.numero || "desconocido";
  const direccion = `${calle} ${numero}`;

  await realizarFetchDriver (id,id_trabajo,categoria,direccion,urlsFotos,descripcion);
 */
  if (result) {
    const id = formData.get("id") as string;
    redirect(`/user/${id}/menu`);
  }
}