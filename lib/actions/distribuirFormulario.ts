"use server";

import { nuevoTrabajo } from "@/lib/actions/nuevoTrabajo";
import { redirect } from "next/navigation";

export async function distribuirFormulario(formData: FormData): Promise<void> {
  const result = await nuevoTrabajo(formData);
  // proximamente se hara los fetch a driverApp y feedbackApp
  if (result) {
    const id = formData.get("id") as string;
    redirect(`/user/${id}/menu`);
  }
}