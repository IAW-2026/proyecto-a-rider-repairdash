"use client";

import { Plus } from "lucide-react";
import { Button } from "@/app/components/ui";

export default function BotonAgregarDestino({ id }: { id: string }) {
  return (
    <Button
      href={`/user/${id}/solicitudNuevaUbicacion`}
      variant="secondary"
      size="sm"
    >
      <Plus size={14} strokeWidth={1.75} />
      Agregar destino
    </Button>
  );
}
