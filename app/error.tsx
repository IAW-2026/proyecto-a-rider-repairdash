"use client";

import { AlertTriangle } from "lucide-react";
import { Button, Card } from "@/app/components/ui";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center sm:p-7 flex flex-col items-center gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rd-danger-bg border border-rd-danger/30 grid place-items-center text-rd-danger">
          <AlertTriangle size={28} strokeWidth={1.75} />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-rd-text">
            Algo salió mal
          </h2>
          <p className="text-sm text-rd-muted mt-1.5">
            Ocurrió un error inesperado. Ya lo estamos registrando.
          </p>
        </div>
        <Button onClick={reset} fullWidth>
          Intentar de nuevo
        </Button>
      </Card>
    </div>
  );
}
