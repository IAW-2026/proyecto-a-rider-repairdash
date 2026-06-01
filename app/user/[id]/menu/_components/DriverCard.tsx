import { User } from "lucide-react";
import Stars from "@/app/components/ui/Stars";

const DRIVER_HARDCODED = {
  nombre: "Driver Prueba Entrega",
  calificacion: 4.8,
};

export default function DriverCard() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-rd-elevated border border-rd-border-2">
      <div className="w-11 h-11 shrink-0 rounded-full bg-rd-accent/20 border border-rd-accent/30 grid place-items-center text-rd-accent-soft">
        <User size={22} strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-rd-muted mb-0.5">
          Tu técnico
        </p>
        <p className="font-semibold text-rd-text text-[15px] leading-tight truncate">
          {DRIVER_HARDCODED.nombre}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Stars value={DRIVER_HARDCODED.calificacion} size={13} />
          <span className="text-[12px] text-rd-muted font-medium">
            {DRIVER_HARDCODED.calificacion.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
