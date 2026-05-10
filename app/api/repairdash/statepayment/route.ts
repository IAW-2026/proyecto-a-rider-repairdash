/*import { deletePago, deleteViaje, getPagosByViajeId, updateViaje } from "@/lib/queries"

export async function PUT( req:Request){

    const expected = process.env.REPAIRDASH_API_KEY;
    const received = request.headers.get("x-api-key");

    if (!expected) return 500;
    if (received !== expected) return 401;
    const body = await req.json();
    const state = String(body.estado).toLowerCase(); 
    let message = ''
    
    const id_viaje = Number(body.id_viaje);
    
    switch (state) {
        case "aceptado":
            await updateViaje(id_viaje, {
                estado: "aceptado",
            });
            message = "Viaje aceptado";
            break;

        case "cancelado":
            const pagos = await getPagosByViajeId(id_viaje);
            await updateViaje(id_viaje, {
                estado: "cancelado",
            });
            message = "Viaje cancelado";
            break;
    }
    return new Response(JSON.stringify({ message }), { status: 200 })
}
*/
export{};