"use server";

import { nuevoTrabajo } from "@/lib/actions/nuevoTrabajo";
import { mandarPromocionUsada } from "@/lib/actions/apis/promotions/mandarPromocionUsada";
import { realizarFetchDriver } from "@/lib/actions/apis/driver/realizarFetchDriver";
import { getUbicacionById } from "@/lib/queries/ubicacion";
import { cancelarViaje } from "@/lib/actions/viajes";
import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { getCalificacionCliente, getClienteActual } from "./clientes";
import { obtenerCalificacionCliente } from "./apis/feedback/obtenerCalificacionCliente";
import { updateClienteByClerkID } from "../queries";

export async function distribuirFormulario(formData: FormData): Promise<void> {
  const result = await nuevoTrabajo(formData);
  const cliente = await getClienteActual();

  const valoracionActual = await obtenerCalificacionCliente(cliente.id_clerk);

  if (result) {
    const promocionIdRaw = formData.get("promocionId") as string;
    const promocionId = promocionIdRaw ? Number(promocionIdRaw) : 0;
    console.log(
      "[distribuirFormulario] promocionId del form:",
      promocionId,
      "userId:",
      cliente.id_clerk,
    );
    if (promocionId) {
      const montoSinDescuento = Number(formData.get("montoSinDescuento")) || 0;
      const montoConDescuento = Number(formData.get("montoConDescuento")) || 0;

      try {
        await mandarPromocionUsada(
          cliente.id_clerk,
          promocionId,
          result.id_viaje,
          montoSinDescuento,
          montoConDescuento,
        );
      } catch (err) {
        console.error("[mandarPromocionUsada] fallo:", err);
      }
    }

    // Subir fotos al storage de Supabase y obtener URLs públicas
    const fotos = formData.getAll("foto") as File[];
    const urlsFotos: string[] = [];

    for (const foto of fotos) {
      const buffer = Buffer.from(await foto.arrayBuffer());
      const extension = foto.name.split(".").pop() ?? "jpg";
      const path = `${result.id_viaje}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

      const { error } = await supabaseServer.storage
        .from("trabajos")
        .upload(path, buffer, { contentType: foto.type, upsert: false });

      if (error) {
        console.error(
          "[distribuirFormulario] error subiendo foto:",
          error.message,
        );
        continue;
      }

      const { data } = supabaseServer.storage
        .from("trabajos")
        .getPublicUrl(path);
      urlsFotos.push(data.publicUrl);
    }

    // Obtener dirección de la ubicación seleccionada
    const idUbicacion = Number(formData.get("id_ubicacion"));
    const tipoServicioId = formData.get("tipoServicioId") as string;
    const descripcion = formData.get("descripcion") as string;

    let direccion = "";
    if (idUbicacion) {
      const ubicacion = await getUbicacionById(idUbicacion);
      if (ubicacion) {
        direccion = `${ubicacion.calle} ${ubicacion.numero}`;
      }
    }

    try {
      await realizarFetchDriver(
        cliente.id_clerk,
        tipoServicioId,
        String(result.id_viaje),
        direccion,
        urlsFotos,
        descripcion,
        cliente.nombre || "",
        cliente.apellido || "",
        valoracionActual,
      );
    } catch (err) {
      console.error(
        "[realizarFetchDriver] fallo, haciendo rollback del viaje:",
        err,
      );
    }

    redirect(`/user/${cliente.id_clerk}/menu`);
  }
}
