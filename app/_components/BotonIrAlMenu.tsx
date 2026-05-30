"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui";

export default function BotonIrAlMenu() {
  const router = useRouter();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (!userId) return;
    setIsLoading(true);
    router.push(`/user/${userId}/menu`);
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
