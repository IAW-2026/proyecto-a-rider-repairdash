

import {  getViajeById, getPagosByViajeId, updateEstadoViaje, asignarDriverViaje } from "../../../../lib/queries"
import { cancelacionPayment } from "@/lib/actions/apis/payment/cancelarPayment";

export async function PUT( req:Request){

    const expected = process.env.REPAIRDASH_API_KEY;
    const received = req.headers.get("x-api-key");

    if (!expected) return new Response("Internal Server Error", { status: 500 });
    if (received !== expected) return new Response("Unauthorized", { status: 401 });
    
    const body = await req.json();
    const state = String(body.estado).toLowerCase(); 
    let message = ''
    
    const id_viaje = Number(body.id_viaje);
    const id_driver = body.driver ? String(body.driver) : null;

    const estadoActual = (await getViajeById(id_viaje))?.estado?.toLowerCase();
    if (estadoActual === "cancelado" || estadoActual === "concluido" || estadoActual === "finalizado") {
        return new Response(JSON.stringify({ message: "El viaje ya no esta activo" }), { status: 400 });
    }
    
    switch (state) {
        case "aceptado":
            await updateEstadoViaje(id_viaje, "aceptado");
            if (id_driver) {
                await asignarDriverViaje(id_viaje, id_driver);
            }
            message = "Viaje aceptado";
            break;

        case "cancelado":
            const pagos = await getPagosByViajeId(id_viaje);
            await updateEstadoViaje(id_viaje, "cancelado");
            await cancelacionPayment(id_viaje);
            message = "Viaje cancelado";
            break;
            
        case "en camino":
            await updateEstadoViaje(id_viaje, "en camino");
            message = "En camino";
            break;

        case "finalizado":
            await updateEstadoViaje(id_viaje, "finalizado");
            message = "Finalizado";
            break;

        case "ha llegado":
            await updateEstadoViaje(id_viaje, "ha llegado");
            message = "Ha llegado";
            break;

        default:
            return new Response(JSON.stringify({ message: "Estado no válido" }), { status: 400 });
    }
    return new Response(JSON.stringify({ message }), { status: 200 })
}