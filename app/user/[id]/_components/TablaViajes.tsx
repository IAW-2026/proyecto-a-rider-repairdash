import { Wrench, Inbox } from "lucide-react";
import { Pill } from "@/app/components/ui";
import type { PillTone } from "@/app/components/ui";

type ViajeRow = {
  id_viaje: number;
  tipo_de_trabajo: string;
  fecha?: Date | string | null;
  estado?: string | null;
  driver?: string | null;
  pagos?: Array<{ monto: unknown }>;
};

const estadoTone = (estado?: string | null): PillTone => {
  const e = (estado ?? "").toLowerCase();
  if (e === "concluido" || e === "finalizado") return "ok";
  if (e === "pendiente") return "warn";
  if (e === "aceptado" || e === "ha llegado") return "accent";
  if (e === "en camino") return "info";
  if (e === "cancelado") return "danger";
  return "mute";
};

const fmtMonto = (m?: unknown): string => {
  if (m == null) return "—";
  const num = Number(typeof m === "number" || typeof m === "string" ? m : String(m));
  if (Number.isNaN(num)) return "—";
  return "$ " + num.toLocaleString("es-AR");
};

const fmtFecha = (f?: Date | string | null): string => {
  if (!f) return "—";
  const d = typeof f === "string" ? new Date(f) : f;
  return d.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export default function TablaViajes({ filas }: { filas: ViajeRow[] }) {
  if (filas.length === 0) {
    return (
      <div className="rounded-xl p-10 flex flex-col items-center gap-3 text-center bg-rd-bg-2 border border-rd-border">
        <div className="w-12 h-12 rounded-xl bg-rd-elevated grid place-items-center text-rd-accent-soft">
          <Inbox size={22} strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-rd-text font-semibold">Sin viajes todavía</p>
          <p className="text-sm text-rd-muted mt-1">
            Cuando solicites tu primer servicio aparecerá acá.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-rd-border bg-rd-surface overflow-hidden">
      {/* Desktop / tablet: tabla con scroll horizontal cuando hace falta */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <table className="w-full min-w-[860px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[26%]" />
            <col className="w-[24%]" />
            <col className="w-[22%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead className="bg-rd-bg-2">
            <tr>
              {["Servicio", "Fecha", "Trabajador", "Costo", "Estado"].map(
                (h, i) => (
                  <th
                    key={h}
                    className={`py-4 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-rd-muted whitespace-nowrap ${
                      i === 0
                        ? "pl-40 lg:pl-48 pr-4"
                        : i === 4
                          ? "pr-8 lg:pr-10 pl-4"
                          : "px-4 lg:px-5"
                    }`}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filas.map((v) => (
              <tr
                key={v.id_viaje}
                className="border-b border-rd-border last:border-b-0 hover:bg-rd-elevated/40 transition-colors"
              >
                <td className="pl-8 lg:pl-10 pr-4 py-4 align-middle">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-lg bg-rd-elevated grid place-items-center text-rd-accent-soft shrink-0">
                      <Wrench size={15} strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[13.5px] capitalize text-rd-text break-words">
                        {v.tipo_de_trabajo}
                      </div>
                      <div className="font-mono-rd text-[11px] text-rd-muted mt-0.5">
                        #{v.id_viaje}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 lg:px-5 py-4 align-middle text-sm text-rd-text-2 whitespace-nowrap">
                  {fmtFecha(v.fecha)}
                </td>
                <td className="px-4 lg:px-5 py-4 align-middle text-sm text-rd-text-2 break-words">
                  {v.driver ?? "Pendiente de asignación"}
                </td>
                <td className="px-4 lg:px-5 py-4 align-middle text-sm font-semibold tabular-rd text-rd-text whitespace-nowrap">
                  {fmtMonto(v.pagos?.[0]?.monto)}
                </td>
                <td className="pr-8 lg:pr-10 pl-4 py-4 align-middle whitespace-nowrap">
                  <Pill tone={estadoTone(v.estado)} dot>
                    {v.estado ?? "—"}
                  </Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden flex flex-col">
        {filas.map((v) => (
          <div
            key={v.id_viaje}
            className="p-4 border-b border-rd-border last:border-b-0"
          >
            <div className="flex items-center justify-between mb-2">
              <Pill tone={estadoTone(v.estado)} size="sm">
                {v.estado ?? "—"}
              </Pill>
              <span className="font-mono-rd text-[10.5px] text-rd-muted">
                #{v.id_viaje}
              </span>
            </div>
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <div className="font-bold text-[13.5px] capitalize text-rd-text break-words">
                  {v.tipo_de_trabajo}
                </div>
                <div className="text-[11.5px] text-rd-muted mt-0.5 break-words">
                  {(v.driver ?? "Sin trabajador")} · {fmtFecha(v.fecha)}
                </div>
              </div>
              <span className="text-[15px] font-bold tabular-rd text-rd-text shrink-0 whitespace-nowrap">
                {fmtMonto(v.pagos?.[0]?.monto)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
