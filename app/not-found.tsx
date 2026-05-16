import { Search } from "lucide-react";
import { Button, Card } from "@/app/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center sm:p-7 flex flex-col items-center gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rd-elevated border border-rd-border-2 grid place-items-center text-rd-lavender">
          <Search size={28} strokeWidth={1.75} />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-rd-muted mb-1.5">
            Error 404
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-rd-text">
            Página no encontrada
          </h2>
          <p className="text-sm text-rd-muted mt-1.5">
            La página que buscás no existe o fue movida.
          </p>
        </div>
        <Button href="/" fullWidth>
          Volver al inicio
        </Button>
      </Card>
    </div>
  );
}
