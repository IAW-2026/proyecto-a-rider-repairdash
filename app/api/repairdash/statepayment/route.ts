import { getPagosByViajeId, updateEstadoViaje, asignarDriverViaje, updatePago } from "../../../../lib/queries"


export async function PUT( req:Request){

    const expected = process.env.REPAIRDASH_API_KEY;
    const received = req.headers.get("x-api-key");

    if (!expected) return new Response("Internal Server Error", { status: 500 });
    if (received !== expected) return new Response("Unauthorized", { status: 401 });
    
    const body = await req.json();
    const state = String(body.estado).toLowerCase(); 
    let message = ''
    
    const id_viaje = Number(body.id_viaje);
    
    switch (state) {
        case "aceptado":
            await updatePago(id_viaje, "aceptado");
            await updateEstadoViaje(id_viaje, "aceptado");
            message = "pago aceptado";
            break;

        case "rechazado":
            const pagos = await getPagosByViajeId(id_viaje);
            await updateEstadoViaje(id_viaje, "cancelado");
            message = "pago rechazado";
            break;
    }
    return new Response(JSON.stringify({ message }), { status: 200 })
}