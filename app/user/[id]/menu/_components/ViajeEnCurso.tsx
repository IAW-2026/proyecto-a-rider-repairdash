"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  User,
  Truck,
  MapPin,
  Check,
  CheckCircle2,
  XCircle,
  Sparkles,
  CreditCard,
} from "lucide-react";
import BotonConformidad from "./BotonConformidad";
import BotonDisconformidad from "./BotonDisconformidad";
import BotonAceptarCancelacion from "./BotonAceptarCancelacion";
import BotonCancelarViaje from "./BotonCancelarViaje";
import BotonIrAPagar from "./BotonIrAPagar";
import { Pill } from "@/app/components/ui";
import DriverCard from "./DriverCard";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { realizarFetchPayment } from "@/lib/actions/apis/payment/realizarFetchPayment";
import type { DriverInfo } from "@/lib/actions/apis/driver/obtenerInfoDriver";
type StepDef = {
  id: "pendiente" | "aceptado" | "en camino" | "ha llegado";
  label: string;
  Icon: typeof Search;
  description: string;
};

const STEPS: StepDef[] = [
  {
    id: "pendiente",
    label: "Buscando técnico",
    Icon: Search,
    description: "Estamos buscando al mejor profesional para tu solicitud.",
  },
  {
    id: "aceptado",
    label: "Técnico asignado",
    Icon: User,
    description: "Un profesional aceptó tu solicitud y se está organizando.",
  },
  {
    id: "en camino",
    label: "En camino",
    Icon: Truck,
    description: "El técnico se dirige a tu ubicación ahora mismo.",
  },
  {
    id: "ha llegado",
    label: "En tu puerta",
    Icon: MapPin,
    description: "¡El técnico llegó y está listo para comenzar!",
  },
];

const ESTADOS_CANCELABLES = ["pendiente", "aceptado", "en camino", "ha llegado"];

const ESTADO_ORDER = [
  "pendiente",
  "aceptado",
  "en camino",
  "ha llegado",
  "finalizado",
  "concluido",
];

function rangoEstado(e: string | undefined | null) {
  if (!e) return -1;
  return ESTADO_ORDER.indexOf(e);
}

export default function ViajeEnCurso({
  idViaje,
  idClerk,
  estadoInicial,
  pagoEstadoInicial,
  driverInicial,
}: {
  idViaje: number;
  idClerk: string;
  estadoInicial: string;
  pagoEstadoInicial: string | null;
  driverInicial: DriverInfo | null;
}) {
  const [estadoActual, setEstadoActual] = useState<string>(
    estadoInicial.toLowerCase(),
  );
  const [pulse, setPulse] = useState(false);
  const [pagoYaIniciado, setPagoYaIniciado] = useState(false);
  const estadoRef = useRef(estadoInicial.toLowerCase());
  const pagoIniciadoRef = useRef(false);
  useEffect(() => {
    estadoRef.current = estadoActual;
  }, [estadoActual]);

  useEffect(() => {
    setPagoYaIniciado(!!localStorage.getItem(`pago-iniciado-${idViaje}`));
  }, [idViaje]);

  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`viaje-${idViaje}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "viajes",
          filter: `id_viaje=eq.${idViaje}`,
        },
        (payload) => {
          const nuevoEstado = (
            payload.new as { estado?: string }
          ).estado?.toLowerCase();
          if (nuevoEstado) {
            setPulse(true);
            setTimeout(() => setPulse(false), 800);
            setEstadoActual(nuevoEstado);
          }
        },
      )
      .subscribe(async (status) => {
        console.info(`[Realtime] viaje-${idViaje}: ${status}`);
        if (status === "SUBSCRIBED") {
          try {
            const { data } = await supabaseBrowser
              .from("viajes")
              .select("estado")
              .eq("id_viaje", idViaje)
              .single();

            const estadoDB = data?.estado?.toLowerCase();
            if (estadoDB && estadoDB !== estadoRef.current) {
              // No regresar dentro del flujo normal: si la réplica de Supabase
              // devuelve un estado "más atrás" que el que ya tenemos del SSR,
              // ignoramos. "cancelado" no está en el orden y siempre se aplica.
              const enFlujo =
                ESTADO_ORDER.includes(estadoDB) &&
                ESTADO_ORDER.includes(estadoRef.current);
              if (enFlujo && rangoEstado(estadoDB) < rangoEstado(estadoRef.current)) {
                console.info(
                  `[Realtime] Sync ignorado (regresión): ${estadoRef.current} → ${estadoDB}`,
                );
              } else {
                console.info(
                  `[Realtime] Sync al conectar: ${estadoRef.current} → ${estadoDB}`,
                );
                setEstadoActual(estadoDB);
              }
            }
          } catch (e) {
            console.error("[Realtime] Error en sync inicial:", e);
          }
        }
      });

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [idViaje]);

  useEffect(() => {
    if (estadoActual !== "aceptado") return;

    const pagoKey = `pago-iniciado-${idViaje}`;
    if (pagoIniciadoRef.current || localStorage.getItem(pagoKey)) return;

    pagoIniciadoRef.current = true;
    localStorage.setItem(pagoKey, "1");

    (async () => {
      const url = await realizarFetchPayment(idViaje);
      localStorage.setItem(`pago-url-${idViaje}`, url);
      setPagoYaIniciado(true);
      window.location.href = url;
    })();
  }, [estadoActual, idViaje]);

  if (estadoActual === "cancelado") {
    return (
      <div className="w-full rounded-2xl p-6 sm:p-7 bg-gradient-to-b from-rd-danger-bg to-rd-surface border border-rd-danger/30 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-14 h-14 shrink-0 rounded-xl bg-rd-danger-bg border border-rd-danger/40 grid place-items-center text-rd-danger">
          <XCircle size={28} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-rd-danger tracking-tight">
            Servicio cancelado
          </h2>
          <p className="text-rd-muted text-sm mt-1 leading-relaxed">
            Este servicio técnico fue cancelado y ya no está en curso.
          </p>
        </div>
        <div className="sm:w-auto w-full sm:min-w-[180px]">
          <BotonAceptarCancelacion idViaje={idViaje} />
        </div>
      </div>
    );
  }

  if (estadoActual === "finalizado") {
    const pagado = pagoEstadoInicial?.toLowerCase() === "aceptado";

    if (!pagado) {
      return (
        <div className="w-full rounded-2xl p-6 sm:p-7 bg-gradient-to-b from-rd-warn-bg to-rd-surface border border-rd-warn/30 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-rd-warn-bg border border-rd-warn/40 grid place-items-center text-rd-warn">
            <CreditCard size={26} strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-rd-warn tracking-tight">
              Servicio finalizado
            </h2>
            <p className="text-rd-muted text-sm mt-1 leading-relaxed">
              El técnico terminó el trabajo. Aboná el servicio para confirmar tu
              conformidad o reportar un problema.
            </p>
          </div>
          <div className="w-full sm:w-auto sm:min-w-[200px]">
            <BotonIrAPagar url={localStorage.getItem(`pago-url-${idViaje}`)} />
          </div>
        </div>
      );
    }

    return (
      <div className="w-full rounded-2xl p-6 sm:p-7 bg-gradient-to-b from-rd-ok-bg to-rd-surface border border-rd-ok/30 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-14 h-14 shrink-0 rounded-xl bg-rd-ok grid place-items-center text-[#0d2419]">
          <CheckCircle2 size={28} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-rd-ok tracking-tight">
            Servicio finalizado
          </h2>
          <p className="text-rd-muted text-sm mt-1 leading-relaxed">
            ¿Quedaste conforme con el trabajo? Confirmá para cerrar el servicio.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:min-w-[200px]">
          <BotonConformidad idViaje={idViaje} />
          <BotonDisconformidad idViaje={idViaje} />
        </div>
      </div>
    );
  }

  if (estadoActual === "concluido") {
    return (
      <div className="w-full rounded-2xl p-6 sm:p-7 bg-gradient-to-b from-rd-ok-bg to-rd-surface border border-rd-ok/30 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-14 h-14 shrink-0 rounded-xl bg-rd-ok/20 border border-rd-ok/40 grid place-items-center text-rd-ok">
          <Sparkles size={26} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-rd-ok tracking-tight">
            ¡Gracias por confirmar!
          </h2>
          <p className="text-rd-muted text-sm mt-1 leading-relaxed">
            Actualizando tu historial…
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.id === estadoActual);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const totalSteps = STEPS.length;
  const lineProgressPercentage =
    totalSteps > 1 ? (activeIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div
      className={`w-full rounded-2xl p-6 sm:p-7 bg-rd-surface border border-rd-border-2 transition-colors duration-300 ${pulse ? "ring-2 ring-rd-accent/40" : ""
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-rd-text tracking-tight">
            Estado del servicio
          </h2>
          <p className="text-xs text-rd-muted mt-1">Seguimiento en vivo</p>
        </div>
        <Pill tone="accent" dot pulse>
          En vivo
        </Pill>
      </div>

      {/* Driver card — visible desde "aceptado" en adelante */}
      {["aceptado", "en camino", "ha llegado"].includes(estadoActual) && (
        <div className="mb-6">
          <DriverCard idViaje={idViaje} driverInicial={driverInicial} />
        </div>
      )}

      {/* Stepper */}
      <div className="relative pl-1">
        <div
          className="absolute left-[25px] top-[26px] bottom-[26px] w-[2px] bg-rd-border-2 rounded-full z-0"
          aria-hidden
        />
        <div
          className="absolute left-[25px] top-[26px] w-[2px] rounded-full z-0 transition-[height] duration-500 ease-out bg-gradient-to-b from-rd-accent to-rd-purple"
          style={{ height: `calc(${lineProgressPercentage}% - 6px)` }}
          aria-hidden
        />

        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isCurrent = index === activeIndex;
          const Icon = step.Icon;
          const isLast = index === STEPS.length - 1;

          return (
            <div
              key={step.id}
              className={`flex gap-4 sm:gap-5 relative z-10 ${isLast ? "" : "mb-7"}`}
            >
              <div
                className={`w-[50px] h-[50px] shrink-0 rounded-full grid place-items-center transition-all duration-300 border ${isCurrent
                    ? "bg-rd-accent border-rd-accent text-white"
                    : isCompleted
                      ? "bg-rd-elevated border-rd-border-3 text-rd-accent-soft"
                      : "bg-rd-bg border-rd-border text-rd-subtle"
                  }`}
                style={
                  isCurrent
                    ? {
                      boxShadow:
                        "0 0 0 5px var(--color-rd-bg), 0 0 0 6px var(--color-rd-accent-dim)",
                    }
                    : { boxShadow: "0 0 0 5px var(--color-rd-bg)" }
                }
              >
                {isCompleted ? (
                  <Check size={20} strokeWidth={2} />
                ) : (
                  <Icon size={20} strokeWidth={1.75} />
                )}
              </div>

              <div className="pt-1 flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className={`text-[15px] font-bold transition-colors ${isCurrent
                        ? "text-rd-text"
                        : isCompleted
                          ? "text-rd-text-2"
                          : "text-rd-subtle"
                      }`}
                  >
                    {step.label}
                  </h3>
                  {isCurrent && (
                    <Pill tone="accent" size="sm">
                      Ahora
                    </Pill>
                  )}
                  {isCompleted && (
                    <Pill tone="ok" size="sm">
                      Listo
                    </Pill>
                  )}
                </div>
                {isCurrent && (
                  <p className="text-xs text-rd-muted leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-7 pt-5 border-t border-rd-border">
        <div className="flex justify-between text-[11.5px] text-rd-muted mb-2 font-medium">
          <span>Progreso</span>
          <span className="text-rd-accent-soft font-bold tabular-rd">
            {Math.round(lineProgressPercentage)}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-rd-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rd-accent to-rd-purple rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${lineProgressPercentage}%` }}
          />
        </div>
      </div>

      {pagoYaIniciado &&
        ["aceptado", "en camino", "ha llegado"].includes(estadoActual) && (
          <>
            {pagoEstadoInicial?.toLowerCase() == "pendiente" ? (
              <div className="mt-4">
                <BotonIrAPagar url={localStorage.getItem(`pago-url-${idViaje}`)} />
              </div>
            ) : (
              <div className="mt-4 rounded-xl px-4 py-3 bg-rd-ok-bg border border-rd-ok/30 flex items-center gap-3">
                <CheckCircle2
                  size={20}
                  strokeWidth={1.75}
                  className="text-rd-ok shrink-0"
                />
                <p className="text-sm font-semibold text-rd-ok">
                  Viaje pago
                </p>
              </div>
            )}
            <div className="mt-4">
              <BotonCancelarViaje idViaje={idViaje} />
            </div>
          </>
        )}

    </div>
  );
}


