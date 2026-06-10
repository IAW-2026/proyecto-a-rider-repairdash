"use server";
import { getViajeById } from "@/lib/queries/viajes";

export async function generarReporte(idViaje: number) {
  const apiKey = process.env.NEXT_PUBLIC_FEEDBACK_API_KEY;
  if (!apiKey) throw new Error("No se encontro la API Key");
  const consult = await getViajeById(idViaje);
  if (!consult) return { success: false };

  const driver = consult.driver;
  if (!driver) return { success: false };

  const id_clerk = consult.id_clerk;
  if (!id_clerk) return { success: false };

  const res = await fetch(
    `https://proyecto-a-feedback-repairdash.vercel.app/api/reports`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        idTrabajo: String(idViaje),
        idReportante: id_clerk,
        idReportado: driver,
      }),
    },
  );

  if (!res.ok) {
    throw new Error("Error al generar el reporte");
  }

  console.log(res);
}
