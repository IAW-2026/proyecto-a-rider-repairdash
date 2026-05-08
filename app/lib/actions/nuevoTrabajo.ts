"use server"

import { crearViajeYPago } from "@/app/lib/actions/viajes";
import { redirect } from "next/navigation";

export async function nuevoTrabajo(formData: FormData){
 const result = await crearViajeYPago(formData);
 if(result){
    redirect(`/user/${formData.get("id")}/menu`);
 }
}
