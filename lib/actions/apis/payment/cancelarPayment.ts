"use server"
import { getViajeById } from "@/lib/queries";
export async function cancelacionPayment( id_viaje:number ){
    const apiKey = process.env.NEXT_PUBLIC_PAYMENT_KEY;
    const viaje = await getViajeById(id_viaje);
    const result = viaje?.pagos?.[0]?.estado;
    if (!apiKey) throw new Error('Missing API key NEXT_PUBLIC_PAYMENT_KEY');

    if(result === "pendiente" ){
    const res = await fetch('https://proyecto-a-payments-repairdash.vercel.app/api/payments/checkout/cancel', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-internal-api-key': apiKey
        },
        body: JSON.stringify({ trabajoId: String(id_viaje) })
    });

    if (!res.ok) {
        const errBody = await res.text();
        console.error(`[Payment] API ${res.status} response body:`, errBody);
        throw new Error(`Payment API error: ${res.status} — ${errBody}`);
    }
    else{
        console.log(`[Payment] Cancelación exitosa para viaje ${id_viaje}`);
    }
    }
}

