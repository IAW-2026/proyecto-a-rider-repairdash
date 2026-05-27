"use server"

import { getViajeById,getClienteById } from "@/lib/queries"
import { redirect } from "next/navigation"

export async function realizarFetchPayment( id_viaje:number ){
    const result = await getViajeById(id_viaje);

    if (!result) throw new Error(`Viaje ${id_viaje} not found`);
    if (result.id_cliente == null) throw new Error(`Viaje ${id_viaje} has no cliente`);

    const id = (await getClienteById(result.id_cliente))?.id_clerk;
    const pago = result.pagos[0];
    const apiKey = process.env.NEXT_PUBLIC_PAYMENT_KEY;

    if (!apiKey) throw new Error('Missing API key NEXT_PUBLIC_PAYMENT_KEY');
    if (!pago) throw new Error(`No payment found for viaje ${id_viaje}`);

    const amount = Number(pago.monto);

    const payload = { trabajoId: String(id_viaje), clientId: id, trabajadorId: result?.driver, amount: String(amount), description: result?.tipo_de_trabajo };
    console.log('[Payment] Request payload:', payload);

    if (pago.estado === "pendiente") {
    const res = await fetch('https://proyecto-a-payments-repairdash.vercel.app/api/payments/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-internal-api-key': apiKey
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const errBody = await res.text();
        console.error(`[Payment] API ${res.status} response body:`, errBody);
        throw new Error(`Payment API error: ${res.status} — ${errBody}`);
    }

    const data = await res.json();
    redirect(data.redirectUrl);
    }
}


