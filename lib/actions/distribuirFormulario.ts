"use server";

import { nuevoTrabajo } from "@/lib/actions/nuevoTrabajo";
import { redirect } from "next/navigation";

export async function distribuirFormulario(formData: FormData): Promise<void> {
  const result = await nuevoTrabajo(formData);  
 // proximamente se hara los fetch a driverApp y feedbackApp
}