import { Wrench, ShieldCheck, Activity, CheckCircle2 } from "lucide-react";
import BotonLogIn from "./components/BotonLogIn";
import Lazy from "./components/lazyProvisioning";
import { Pill } from "./components/ui";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full opacity-25 blur-[120px] pointer-events-none bg-rd-accent"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full opacity-20 blur-[120px] pointer-events-none bg-rd-purple"
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-md w-full">
        <Lazy />

        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl grid place-items-center text-white bg-rd-accent">
            <Wrench size={28} strokeWidth={1.75} />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-rd-text">
            Repair<span className="text-rd-accent">Dash</span>
          </h1>
          <p className="text-sm font-medium text-rd-muted">
            Tu plataforma de servicios técnicos
          </p>
        </div>

        <div className="w-full rounded-2xl p-6 bg-rd-surface border border-rd-border-2 flex flex-col items-center gap-3">
          <Pill tone="ok" dot pulse>
            Realtime · activo
          </Pill>
          <h2 className="text-xl font-bold leading-tight text-rd-text">
            Solicitá un técnico verificado en minutos.
          </h2>
          <p className="text-sm text-rd-muted leading-relaxed">
            Seguimiento en vivo de tu servicio, pagos seguros.
          </p>
        </div>

        <BotonLogIn />

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11.5px] text-rd-muted">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} strokeWidth={1.75} className="text-rd-ok" />
            Seguro
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Activity size={14} strokeWidth={1.75} className="text-rd-info" />
            En vivo
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2
              size={14}
              strokeWidth={1.75}
              className="text-rd-accent-soft"
            />
            Verificado
          </span>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center text-[11px] text-rd-muted">
        © 2026 RepairDash
      </div>
    </main>
  );
}
