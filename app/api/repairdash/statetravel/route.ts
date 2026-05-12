

/*import { getPagosByViajeId, updateEstadoViaje, asignarDriverViaje } from "../../../../lib/queries"

export async function PUT( req:Request){

    const expected = process.env.REPAIRDASH_API_KEY;
    const received = req.headers.get("x-api-key");

    if (!expected) return 500;
    if (received !== expected) return 401;
    
    const body = await req.json();
    const state = String(body.estado).toLowerCase(); 
    let message = ''
    
    const id_viaje = Number(body.id_viaje);
    const id_driver = body.driver ? String(body.driver) : null;
    
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
}*/
export {};