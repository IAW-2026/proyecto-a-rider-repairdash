"use client";

import { Plus } from "lucide-react";
import { Button } from "@/app/components/ui";

export default function BotonNuevoTrabajo({ id }: { id: string }) {
  return (
    <Button href={`/user/${id}/solicitudTrabajoActual`} size="lg">
      <Plus size={16} strokeWidth={2} />
      Nuevo trabajo
    </Button>
  );
}
