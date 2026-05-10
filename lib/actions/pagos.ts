"use server";

import { getPagosByViajeId, deletePago } from "../queries/pagos";

export async function cancelarPago(idViaje: number) {
  try {
    const pagos = await getPagosByViajeId(idViaje);
    if (pagos && pagos.length > 0) {
      // Borramos el primer pago asociado al viaje
      await deletePago(pagos[0].id_pago);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error al cancelar pago:", error);
    return false;
  }
}