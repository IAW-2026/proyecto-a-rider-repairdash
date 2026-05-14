"use server"

import { crearUbicacion } from "./ubicacion";
import { redirect } from "next/navigation";
import { getUbicacionesPorCliente } from "./ubicacion";

/**
 * Valida con Nominatim (OpenStreetMap) que la dirección exista en Argentina.
 * Retorna true si encuentra al menos un resultado dentro del país.
 */
async function esUbicacionValidaEnArgentina(
  calle: string,
  numero: string,
  ciudad: string
): Promise<boolean> {
  const query = [calle, numero, ciudad, "Argentina"].filter(Boolean).join(", ");

  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "1",
    countrycodes: "ar",       // Solo Argentina
    addressdetails: "1",
  });

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    {
      headers: {
        // Nominatim requiere un User-Agent identificable
        "User-Agent": "RepairDash/1.0 (contact@repairdash.app)",
      },
      // No cachear: necesitamos datos frescos por cada validación
      cache: "no-store",
    }
  );

  if (!res.ok) {
    // Si la API falla, dejamos pasar (no bloqueamos al usuario por un error externo)
    console.warn("[Nominatim] Error al validar dirección, se omite validación");
    return true;
  }

  const data = await res.json();
  return Array.isArray(data) && data.length > 0;
}

export async function nuevaUbicacion(formData: FormData) {
  const id     = formData.get("id")     as string;
  const calle  = formData.get("calle")  as string;
  const numero = formData.get("numero") as string;
  const ciudad = formData.get("ciudad") as string;

  // 1. Validar que la dirección existe en Argentina
  const esValida = await esUbicacionValidaEnArgentina(calle, numero, ciudad);
  if (!esValida) {
    redirect(`/user/${id}/solicitudNuevaUbicacion`);
  }

  else{
  // 2. Verificar que el usuario no tenga esa ubicación ya cargada
  const ubicaciones = await getUbicacionesPorCliente(id);
  var encontrado = false;
  for (const ubicacion of ubicaciones) {
    if (
      ubicacion.calle === calle &&
      ubicacion.numero === numero &&
      ubicacion.ciudad === ciudad
    ) {
      encontrado = true;
    }
  }

  if (encontrado){

  // 3. Guardar y redirigir
  await crearUbicacion(formData);
  redirect(`/user/${id}/solicitudTrabajoActual`);
  }
  }
}


