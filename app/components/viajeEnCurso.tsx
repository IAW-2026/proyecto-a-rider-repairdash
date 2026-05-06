"use client";

import { useEffect, useState } from "react";
import { cancelarViaje, getEstadoViaje } from "@/app/lib/actions/viajes";
import { cancelarPago } from "../lib/actions/pagos";

const STEPS = [
  { id: "pendiente",  label: "Buscando técnico",  icon: "🔍", description: "Estamos buscando al mejor profesional para tu solicitud." },
  { id: "aceptado",   label: "Técnico asignado",  icon: "👷", description: "Un profesional ha aceptado tu solicitud y está en camino." },
  { id: "en camino",  label: "En camino",          icon: "🚗", description: "El técnico se dirige a tu ubicación ahora mismo." },
  { id: "ha llegado", label: "En tu puerta",       icon: "📍", description: "¡El técnico ha llegado y está listo para comenzar!" },
  { id: "finalizado", label: "Completado",          icon: "✅", description: "El trabajo ha finalizado con éxito. ¡Gracias por confiar en nosotros!" },
];

export default function ViajeEnCurso({ idViaje }: { idViaje: number }) {
  const [estadoActual, setEstadoActual] = useState<string>("pendiente");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Si el viaje ya terminó o se canceló, no hace falta seguir preguntando a la BD
    if (estadoActual === "cancelado" || estadoActual === "finalizado") {
      return;
    }

    const fetchInitial = async () => {
      const estadoBD = await getEstadoViaje(idViaje);
      if (estadoBD) setEstadoActual(estadoBD.toLowerCase());
    };
    fetchInitial();

    const interval = setInterval(async () => {
      try {
        const estadoBD = await getEstadoViaje(idViaje);
        if (estadoBD) {
          const nuevoEstado = estadoBD.toLowerCase();
          if (nuevoEstado !== estadoActual) {
            setPulse(true);
            setTimeout(() => setPulse(false), 800);
            setEstadoActual(nuevoEstado);
          }
        }
      } catch (e) {
        console.error("Error en polling:", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [idViaje, estadoActual]);

  // Manejo de limpieza cuando el estado es cancelado
  useEffect(() => {
    if (estadoActual === "cancelado") {
      const limpiarDatos = async () => {
        try {
          await cancelarViaje(idViaje);
          await cancelarPago(idViaje);
          console.log("Viaje y pago eliminados tras cancelación.");
          
          // Esperamos 4 segundos para que el usuario vea el mensaje antes de recargar
          setTimeout(() => {
            window.location.reload();
          }, 4000);
        } catch (e) {
          console.error("Error al limpiar datos tras cancelación:", e);
        }
      };
      limpiarDatos();
    }
  }, [estadoActual, idViaje]);

  if (estadoActual === "cancelado") {
    return (
      <div className="w-full rounded-3xl p-8 bg-red-900/20 border border-red-500/40 flex flex-col items-center gap-5 text-center shadow-[0_0_40px_#ef444420] animate-[fadeIn_0.5s_ease-out]">
        <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-4xl animate-bounce">
          ❌
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-red-400 tracking-tight">Servicio Cancelado</h2>
          <p className="text-brand-text/70 text-sm mt-2 max-w-xs mx-auto">
            Este servicio técnico ha sido cancelado y ya no está en curso.
          </p>
        </div>
      </div>
    );
  }

 
  const currentIndex = STEPS.findIndex((s) => s.id === estadoActual);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const totalSteps = STEPS.length;
  const lineProgressPercentage = totalSteps > 1 ? (activeIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className={`w-full rounded-3xl p-6 sm:p-10 bg-brand-surface/80 border border-brand-purple/40 backdrop-blur-md shadow-[0_8px_48px_#8D62A520] transition-all duration-500 ${pulse ? "shadow-[0_8px_60px_#F500F150]" : ""}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-brand-text tracking-tight">Estado del servicio</h2>
          <p/>
        </div>
        {/* Indicador "en vivo" */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/10 border border-brand-accent/30">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping inline-block" />
          <span className="text-xs font-bold text-brand-accent uppercase tracking-widest">En vivo</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex flex-col relative">
        {/* Línea de fondo */}
        <div className="absolute left-7 top-7 bottom-7 w-0.5 bg-brand-purple/20 rounded-full z-0" />

        {/* Línea activa animada */}
        <div
          className="absolute left-7 top-7 w-0.5 bg-gradient-to-b from-brand-accent to-brand-purple rounded-full z-0 transition-all duration-700 ease-out shadow-[0_0_10px_#F500F1]"
          style={{ height: `calc(${lineProgressPercentage}% + 0.5px)` }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isCurrent   = index === activeIndex;

          return (
            <div
              key={step.id}
              className="flex gap-6 relative z-10 mb-10 last:mb-0"
            >
              {/* Círculo / Icono */}
              <div
                className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center text-2xl transition-all duration-500 ${
                  isCurrent
                    ? `bg-brand-accent shadow-[0_0_28px_#F500F190] scale-110 ring-4 ring-brand-bg ${pulse ? "animate-bounce" : ""}`
                    : isCompleted
                    ? "bg-brand-lavender text-brand-bg scale-100 shadow-md"
                    : "bg-brand-bg border border-brand-purple/30 text-brand-purple/30 scale-95"
                }`}
              >
                {step.icon}
              </div>

              {/* Textos */}
              <div className="flex flex-col justify-center gap-1">
                <div className="flex items-center gap-3">
                  <h3
                    className={`text-xl font-bold transition-colors duration-300 ${
                      isCurrent ? "text-brand-text" : isCompleted ? "text-brand-lavender" : "text-brand-purple/40"
                    }`}
                  >
                    {step.label}
                  </h3>
                  {isCompleted && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-lavender/20 text-brand-lavender border border-brand-lavender/30 font-semibold">
                      Listo
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-accent/20 text-brand-accent border border-brand-accent/40 font-semibold animate-pulse">
                      Ahora
                    </span>
                  )}
                </div>
                {isCurrent && (
                  <p className="text-sm text-brand-muted leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Barra de progreso horizontal inferior */}
      <div className="mt-10 pt-8 border-t border-brand-purple/20">
        <div className="flex justify-between text-xs text-brand-muted mb-2 font-medium">
          <span>Progreso</span>
          <span className="text-brand-accent font-bold">{Math.round(lineProgressPercentage)}%</span>
        </div>
        <div className="h-2 w-full bg-brand-bg rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-accent to-brand-purple rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_#F500F1]"
            style={{ width: `${lineProgressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}