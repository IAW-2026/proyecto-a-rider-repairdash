"use client";

import { useEffect, useRef } from "react";
import { getEstadoViaje } from "@/lib/actions/viajes";

type EstadoViaje =
  | "pendiente"
  | "aceptado"
  | "en camino"
  | "ha llegado"
  | "finalizado"
  | "cancelado"
  | "concluido";

const FLUJO_ESTADOS: EstadoViaje[] = [
  "pendiente",
  "aceptado",
  "en camino",
  "ha llegado",
  "finalizado",
];

const ESTADOS_TERMINALES: EstadoViaje[] = ["finalizado", "cancelado", "concluido"];
const INTERVALO_MS = 50_000;

/**
 * Probabilidad de que el driver cancele el viaje en cada tick.
 * 0.15 = 15% por tick. No aplica cuando ya "ha llegado" (está en el domicilio).
 */
const PROB_CANCELAR = 0.15;

async function llamarApiEstado(
  idViaje: number,
  nuevoEstado: EstadoViaje
): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_REPAIRDASH_API_KEY;

  const res = await fetch("/api/repairdash/statetravel", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { "x-api-key": apiKey } : {}),
    },
    body: JSON.stringify({ id_viaje: idViaje, estado: nuevoEstado, driver: Math.random() % 100}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }
}

function siguienteEstado(estadoActual: EstadoViaje): EstadoViaje | null {
  const idx = FLUJO_ESTADOS.indexOf(estadoActual);
  if (idx === -1 || idx === FLUJO_ESTADOS.length - 1) return null;
  return FLUJO_ESTADOS[idx + 1];
}

/**
 * Hook que avanza el estado de un viaje cada INTERVALO_MS ms llamando a
 * /api/repairdash/statetravel.
 *
 * Flujo: pendiente → aceptado → en camino → ha llegado → finalizado
 * Desde cualquier estado puede derivar en cancelado.
 * El polling se detiene automáticamente al llegar a finalizado o cancelado.
 */
export function useActualizarEstadoViaje(
  idViaje: number,
  cancelar: boolean = false
) {
  // Usamos refs para todo lo que NO debe recrear el effect
  const estadoRef = useRef<EstadoViaje>("pendiente");
  const detenidoRef = useRef(false);
  const cancelarRef = useRef(cancelar);

  // Mantenemos cancelarRef sincronizado sin recrear el effect
  useEffect(() => {
    cancelarRef.current = cancelar;
  }, [cancelar]);

  // El effect SOLO depende de idViaje: se crea una vez por viaje y no se reinicia
  useEffect(() => {
    if (!idViaje) return;

    // Reset para cada viaje nuevo
    estadoRef.current = "pendiente";
    detenidoRef.current = false;

    let intervaloId: ReturnType<typeof setInterval>;

    const detener = () => {
      detenidoRef.current = true;
      clearInterval(intervaloId);
    };

    const avanzar = async () => {
      if (detenidoRef.current) return;

      if (cancelarRef.current) {
        try {
          await llamarApiEstado(idViaje, "cancelado");
          console.info(`[mock] Viaje ${idViaje}: cancelado`);
        } catch (err) {
          console.error("[mock] Error al cancelar:", err);
        }
        detener();
        return;
      }

      // ── Verificar estado real en BD antes de avanzar ──────────────────
      // Si el viaje ya fue cancelado/concluido externamente, detenemos el mock
      // sin mandar ningún PUT y sin generar errores.
      try {
        const estadoBD = await getEstadoViaje(idViaje);
        if (estadoBD) {
          const estadoNorm = estadoBD.toLowerCase() as EstadoViaje;
          if (ESTADOS_TERMINALES.includes(estadoNorm)) {
            console.info(`[mock] Viaje ${idViaje}: ya está en estado terminal (${estadoNorm}), deteniendo.`);
            detener();
            return;
          }
          // Sincronizar ref con la BD por si cambió externamente
          if (FLUJO_ESTADOS.includes(estadoNorm)) {
            estadoRef.current = estadoNorm;
          }
        }
      } catch {
        // Si falla la consulta, seguimos con el estado local
      }
      // ──────────────────────────────────────────────────────────────────

      const proximo = siguienteEstado(estadoRef.current);

      if (!proximo) {
        detener();
        return;
      }

      // ── Cancelación aleatoria (simula driver que rechaza el viaje) ─────
      // Solo puede cancelar si el driver aún no finaliza el viaje.
      const puedeCancel = estadoRef.current !== "ha llegado";
      if (puedeCancel && Math.random() < PROB_CANCELAR) {
        try {
          await llamarApiEstado(idViaje, "cancelado");
          console.info(`[mock] Viaje ${idViaje}: driver canceló (azar) desde "${estadoRef.current}"`);
        } catch (err) {
          console.error("[mock] Error al cancelar por azar:", err);
        }
        detener();
        return;
      }
      // ──────────────────────────────────────────────────────────────────

      try {
        await llamarApiEstado(idViaje, proximo);
        console.info(`[mock] Viaje ${idViaje}: estado → "${proximo}"`);
        estadoRef.current = proximo;

        if (ESTADOS_TERMINALES.includes(proximo)) {
          detener();
        }
      } catch (err) {
        console.error("[mock] Error al actualizar estado:", err);
      }
    };

    // Primer tick inmediato
    avanzar();

    // Interval fijo, no se reinicia nunca salvo que cambie idViaje
    intervaloId = setInterval(avanzar, INTERVALO_MS);

    return () => {
      detener();
    };
  }, [idViaje]); // <-- ÚNICA dependencia: cambia solo cuando es un viaje distinto
}

/**
 * Componente wrapper del hook. Usar en páginas para activar el polling.
 * No renderiza nada visible — solo ejecuta el lado efecto.
 */
export default function ActualizarEstadoViaje({ id }: { id: number }) {
  useActualizarEstadoViaje(id);
  return null;
}