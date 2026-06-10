"use server";

import { updateClienteByClerkID } from "@/lib/queries";

export async function obtenerCalificacionCliente(idClerk: string) {
  const apiKey = process.env.NEXT_PUBLIC_FEEDBACK_API_KEY;
  if (!apiKey) throw new Error("No se encontro la API Key");
  const res = await fetch(
    `https://proyecto-a-feedback-repairdash.vercel.app/api/reviews/user/${idClerk}`,
    {
      headers: {
        "x-api-key": apiKey,
      },
    },
  );

  if (!res.ok) return null;
  const { valoracion } = await res.json();
  await updateClienteByClerkID(idClerk, { calificacion: valoracion });
  return valoracion;
}
