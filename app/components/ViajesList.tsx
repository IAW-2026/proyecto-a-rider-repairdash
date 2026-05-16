"use client";

import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { Pill } from "@/app/components/ui";
import type { PillTone } from "@/app/components/ui";

interface Pago {
  monto: number;
  estado: string;
}

interface Viaje {
  id_viaje: number;
  tipo_de_trabajo: string;
  estado: string;
  fecha: string | null;
  driver: string | null;
  id_cliente: number;
  pagos?: Pago[];
}

const estadoTone = (estado?: string | null): PillTone => {
  const e = (estado ?? "").toLowerCase();
  if (e === "concluido" || e === "finalizado" || e === "completado") return "ok";
  if (e === "pendiente") return "warn";
  if (e === "aceptado" || e === "ha llegado") return "accent";
  if (e === "en camino") return "info";
  if (e === "cancelado") return "danger";
  return "mute";
};

const pagoTone = (estado?: string | null): PillTone => {
  const e = (estado ?? "").toLowerCase();
  if (e === "aceptado" || e === "aprobado" || e === "pagado") return "ok";
  if (e === "rechazado") return "danger";
  if (e === "pendiente") return "warn";
  return "mute";
};

const fmtFecha = (f?: string | null) => {
  if (!f) return "—";
  const d = new Date(f);
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ViajesList({
  initialViajes,
  idCliente,
}: {
  initialViajes: any[];
  idCliente: number;
}) {
  const [viajes, setViajes] = useState<Viaje[]>(initialViajes as Viaje[]);

  useEffect(() => {
    setViajes(initialViajes);
  }, [initialViajes]);

  useEffect(() => {
    const channel = supabaseBrowser
      .channel(`viajes-cliente-${idCliente}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "viajes",
          filter: `id_cliente=eq.${idCliente}`,
        },
        (payload: any) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          if (eventType === "INSERT") {
            const nuevo = newRow as Viaje;
            setViajes((prev) =>
              prev.some((v) => v.id_viaje === nuevo.id_viaje)
                ? prev
                : [nuevo, ...prev],
            );
          } else if (eventType === "UPDATE") {
            const actualizado = newRow as Viaje;
            setViajes((prev) =>
              prev.map((v) =>
                v.id_viaje === actualizado.id_viaje
                  ? { ...v, ...actualizado }
                  : v,
              ),
            );
          } else if (eventType === "DELETE") {
            const eliminado = oldRow as { id_viaje: number };
            setViajes((prev) =>
              prev.filter((v) => v.id_viaje !== eliminado.id_viaje),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [idCliente]);

  if (viajes.length === 0) {
    return (
      <div className="rounded-2xl p-10 bg-rd-bg-2 border border-rd-border flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-xl bg-rd-elevated grid place-items-center text-rd-accent-soft mb-3">
          <Inbox size={22} strokeWidth={1.75} />
        </div>
        <p className="text-rd-text font-semibold">Sin registros</p>
        <p className="text-sm text-rd-muted mt-1">
          Este cliente todavía no tiene viajes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-rd-border bg-rd-surface">
      {/* Desktop tabla */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead className="bg-rd-bg-2">
            <tr>
              {["#", "Servicio", "Trabajador", "Fecha", "Estado", "Pago", "Monto"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-rd-muted"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {viajes.map((v) => (
              <tr
                key={v.id_viaje}
                className="border-b border-rd-border last:border-b-0 hover:bg-rd-elevated/40 transition-colors"
              >
                <td className="px-4 py-3.5 font-mono-rd text-[11.5px] text-rd-muted">
                  {v.id_viaje}
                </td>
                <td className="px-4 py-3.5 font-semibold text-[13.5px] text-rd-text capitalize">
                  {v.tipo_de_trabajo}
                </td>
                <td className="px-4 py-3.5 text-sm text-rd-text-2">
                  {v.driver ?? "—"}
                </td>
                <td className="px-4 py-3.5 text-sm text-rd-text-2">
                  {fmtFecha(v.fecha)}
                </td>
                <td className="px-4 py-3.5">
                  <Pill tone={estadoTone(v.estado)} dot>
                    {v.estado}
                  </Pill>
                </td>
                <td className="px-4 py-3.5">
                  {v.pagos?.[0] && (
                    <Pill tone={pagoTone(v.pagos[0].estado)} size="sm">
                      {v.pagos[0].estado}
                    </Pill>
                  )}
                </td>
                <td className="px-4 py-3.5 text-sm font-semibold tabular-rd text-rd-text">
                  {v.pagos?.[0] != null
                    ? "$ " + Number(v.pagos[0].monto).toLocaleString("es-AR")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col">
        {viajes.map((v) => (
          <div
            key={v.id_viaje}
            className="p-4 border-b border-rd-border last:border-b-0"
          >
            <div className="flex justify-between items-center mb-2">
              <Pill tone={estadoTone(v.estado)} size="sm">
                {v.estado}
              </Pill>
              <span className="font-mono-rd text-[10.5px] text-rd-muted">
                #{v.id_viaje}
              </span>
            </div>
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <div className="font-bold text-[13.5px] capitalize text-rd-text">
                  {v.tipo_de_trabajo}
                </div>
                <div className="text-[11.5px] text-rd-muted mt-1">
                  {(v.driver ?? "Sin trabajador")} · {fmtFecha(v.fecha)}
                </div>
              </div>
              {v.pagos?.[0] != null && (
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold tabular-rd text-rd-text">
                    $ {Number(v.pagos[0].monto).toLocaleString("es-AR")}
                  </div>
                  <Pill tone={pagoTone(v.pagos[0].estado)} size="sm" className="mt-1">
                    {v.pagos[0].estado}
                  </Pill>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
