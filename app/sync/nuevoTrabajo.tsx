"use server";

import { createViaje } from "@/app/lib/queries/viajes";
import { redirect } from "next/navigation";
import nuevoPago from "./nuevoPago";

export async function nuevoTrabajo(formData: FormData){
    const id = formData.get("id") as string;

    const newTrabajo = await createViaje({
        id_cliente: parseInt(id),
        tipo_de_trabajo: formData.get("categoria") as string,
        // Al omitir 'driver', Prisma lo dejará vacío 
        estado: "Pendiente",
    });
    //mandar el post a driver con la misma informacion del formulario
    // Redirigimos al usuario para que vea su nuevo trabajo en el panel
    
    //se crea un nuevo pago asociado al viaje recien creado
    await nuevoPago(formData, newTrabajo.id_viaje);
    redirect(`/user/${id}/menu`);
}
