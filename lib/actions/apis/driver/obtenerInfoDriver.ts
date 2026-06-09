"use server";

import { getViajeById } from "@/lib/queries/viajes";

export type DriverInfo = {
  nombre: string;
  rating_promedio: number;
};

export async function obtenerInfoDriver(driverId: string): Promise<DriverInfo> {
  const apiKey = process.env.NEXT_PUBLIC_DRIVER_KEY;
  if (!apiKey) throw new Error("Missing API key NEXT_PUBLIC_DRIVER_KEY");

  const res = await fetch(
    `https://driver-repairdash.vercel.app/api/drivers/${driverId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    },
  );

  if (!res.ok) {
    const errBody = await res.text();
    console.error(`[Driver] API ${res.status} response body:`, errBody);
    throw new Error(`Driver API error: ${res.status} — ${errBody}`);
  }

  return (await res.json()).data;
}

export async function obtenerInfoDriverPorViaje(
  idViaje: number,
): Promise<DriverInfo | null> {
  const viaje = await getViajeById(idViaje);
  if (!viaje?.driver) return null;
  return obtenerInfoDriver(viaje.driver);
}
