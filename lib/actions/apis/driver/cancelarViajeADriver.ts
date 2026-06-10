"use server";

export async function cancelarViajeADriver(trabajo_id: number) {
  const apiKey = process.env.NEXT_PUBLIC_DRIVER_KEY;
  if (!apiKey) throw new Error("Missing API key NEXT_PUBLIC_DRIVER_KEY");

  const res = await fetch(
    `https://driver-repairdash.vercel.app/api/trabajos/state`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        id_trabajo: String(trabajo_id),
        estado: "cancelado",
      }),
    },
  );

  if (!res.ok) {
    const errBody = await res.text();
    console.error(`[Driver] API ${res.status} response body:`, errBody);
    throw new Error(`Driver API error: ${res.status} — ${errBody}`);
  }
}
