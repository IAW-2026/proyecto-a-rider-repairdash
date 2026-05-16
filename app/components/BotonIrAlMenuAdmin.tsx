"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui";

export default function BotonIrAlMenuAdmin() {
  return (
    <Button href="/admin" size="lg">
      <ArrowRight size={16} strokeWidth={1.75} />
      Ir al panel de administración
    </Button>
  );
}
