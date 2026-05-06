"use server";

import { createViajeConPago } from "@/app/lib/queries/viajes";
import { redirect } from "next/navigation";

export async function nuevoTrabajo(formData: FormData){
    const id = formData.get("id") as string;
    const categoria = formData.get("categoria") as string;
    const monto = formData.get("monto") as string;

    const newTrabajo = await createViajeConPago({
        id_cliente: parseInt(id),
        tipo_de_trabajo: categoria,
        monto: parseInt(monto) || 0,
    });
    
    //mandar el post a driver con la misma informacion del formulario
    // Redirigimos al usuario para que vea su nuevo trabajo en el panel
    redirect(`/user/${id}/menu`);
}
