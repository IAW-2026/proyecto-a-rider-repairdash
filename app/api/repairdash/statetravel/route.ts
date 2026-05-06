
import { deletePago, deleteViaje, getPagosByViajeId, updateViaje } from "@/app/lib/queries"

export async function PUT( req:Request){
    const body = await req.json();
    const state = String(body.estado).toLowerCase(); 
    let message = ''
    
    const id_viaje = Number(body.id_viaje);
    const id_driver = body.driver ? String(body.driver) : null;
    
    switch (state) {
        case "aceptado":
            await updateViaje(id_viaje, {
                driver: id_driver as string,
                estado: "aceptado",
            });
            message = "Viaje aceptado";
            break;

        case "cancelado":
            const pagos = await getPagosByViajeId(id_viaje);
            await deleteViaje(id_viaje);
            if (pagos && pagos.length > 0) {
                await deletePago(pagos[0].id_pago);
            }
            message = "Viaje cancelado";
            break;
            
        case "en camino":
            await updateViaje(id_viaje, {
                estado: "en camino",
            });
            message = "En camino";
            break;

        case "finalizado":
            await updateViaje(id_viaje, {
                estado: "finalizado",
            });
            message = "Finalizado";
            break;

        case "ha llegado":
            await updateViaje(id_viaje, {
                estado: "ha llegado",
            });
            message = "Ha llegado";
            break;

        default:
            return new Response(JSON.stringify({ message: "Estado no válido" }), { status: 400 });
    }
    return new Response(JSON.stringify({ message }), { status: 200 })
}