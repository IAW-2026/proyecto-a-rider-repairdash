"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { getClienteClerkID } from "@/lib/actions/clientes";
import { Button } from "@/app/components/ui";

export default function BotonIrAlMenu() {
  const router = useRouter();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!userId) return;
    setIsLoading(true);
    const id = await getClienteClerkID(userId);
    if (id?.id_cliente) {
      router.push(`/user/${id.id_cliente}/menu`);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading} size="lg">
      {isLoading ? (
        <Loader2 size={16} strokeWidth={1.75} className="animate-spin" />
      ) : (
        <ArrowRight size={16} strokeWidth={1.75} />
      )}
      {isLoading ? "Cargando…" : "Ir al menú"}
    </Button>
  );
}
