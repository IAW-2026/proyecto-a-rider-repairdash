"use server";

import { nuevoTrabajo } from "@/lib/actions/nuevoTrabajo";
import { mandarPromocionUsada } from "@/lib/actions/apis/promotions/mandarPromocionUsada";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function distribuirFormulario(formData: FormData): Promise<void> {
  const result = await nuevoTrabajo(formData);

  if (result) {
    const { userId } = await auth();

    const promocionIdRaw = formData.get("promocionId") as string;
    const promocionId = promocionIdRaw ? Number(promocionIdRaw) : 0;
    console.log("[distribuirFormulario] promocionId del form:", promocionId, "userId:", userId);
    if (userId && promocionId) {
      const montoSinDescuento = Number(formData.get("montoSinDescuento")) || 0;
      const montoConDescuento = Number(formData.get("montoConDescuento")) || 0;

      try {
        await mandarPromocionUsada(
          userId,
          promocionId,
          result.id_viaje,
          montoSinDescuento,
          montoConDescuento,
        );
      } catch (err) {
        console.error("[mandarPromocionUsada] fallo:", err);
      }
    }

    if (userId) {
      redirect(`/user/${userId}/menu`);
    }
  }
}
