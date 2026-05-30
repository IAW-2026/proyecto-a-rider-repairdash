"use server";

import { nuevoTrabajo } from "@/lib/actions/nuevoTrabajo";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function distribuirFormulario(formData: FormData): Promise<void> {
  const result = await nuevoTrabajo(formData);

  if (result) {
    const { userId } = await auth();
    if (userId) {
      redirect(`/user/${userId}/menu`);
    }
  }
}
