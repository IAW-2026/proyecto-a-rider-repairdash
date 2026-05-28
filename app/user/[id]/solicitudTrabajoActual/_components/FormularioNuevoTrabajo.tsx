"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import {
  ArrowRight,
  ChevronLeft,
  Loader2,
  Search,
  User,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { PRECIOS, PrecioconDescuento } from "@/lib/services/pricing";
import BotonAgregarDestino from "./BotonAgregarDestino";
import { distribuirFormulario } from "@/lib/actions/distribuirFormulario";
import { PageHeader, Select, Textarea, Button, Pill } from "@/app/components/ui";

type Ubicacion = {
  id_ubicacion: number | string;
  calle: string;
  numero: number | string;
  ciudad: string;
};

// Descuentos disponibles (mock — vendrán de microservicio de promotions)
const DESCUENTOS = [
  { id: "001", codigo: "DESC001", valor: 10 },
  { id: "002", codigo: "DESC002", valor: 20 },
  { id: "003", codigo: "DESC003", valor: 30 },
  { id: "004", codigo: "DESC004", valor: 40 },
  { id: "005", codigo: "DESC005", valor: 50 },
];

function BotonSolicitar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-5 rounded-xl bg-rd-accent text-white font-semibold text-[15px] transition-colors hover:bg-[#C932BD] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-accent focus-visible:ring-offset-2 focus-visible:ring-offset-rd-bg"
    >
      {pending ? (
        <Loader2 size={16} strokeWidth={2} className="animate-spin" />
      ) : (
        <ArrowRight size={16} strokeWidth={1.75} />
      )}
      {pending ? "Cargando…" : "Solicitar trabajo"}
    </button>
  );
}

export default function FormularioNuevoTrabajo({
  id,
  ubicaciones,
  categoriaInicial,
}: {
  id: string;
  ubicaciones: Ubicacion[];
  categoriaInicial?: string;
}) {
  const router = useRouter();
  const [categoria, setCategoria] = useState(categoriaInicial ?? "");
  const [destinos, setDestinos] = useState("");
  const [descuentoId, setDescuentoId] = useState<string | null>(null);
  const precio = PRECIOS[categoria] ?? null;
  const descuentoSeleccionado =
    DESCUENTOS.find((d) => d.id === descuentoId) ?? null;
  const montoFinal = precio
    ? PrecioconDescuento(precio.monto, descuentoSeleccionado?.valor ?? 0)
    : 0;

  return (
    <div className="py-2 sm:py-4 max-w-5xl mx-auto w-full">
      <button
        type="button"
        onClick={() => router.push(`/user/${id}/menu`)}
        className="inline-flex items-center gap-1 text-sm text-rd-text-2 hover:text-rd-text transition-colors mb-3"
      >
        <ChevronLeft size={16} strokeWidth={1.75} />
        Volver al menú
      </button>

      <PageHeader
        eyebrow="Cliente · Solicitud nueva"
        title="Nuevo trabajo"
        description="Completá los datos de tu solicitud de servicio."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 lg:gap-6">
        <form
          action={distribuirFormulario}
          className="rounded-2xl p-5 sm:p-7 bg-rd-surface border border-rd-border-2 flex flex-col gap-5"
        >
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="monto" value={montoFinal} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Categoría"
              id="categoria"
              name="categoria"
              required
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="" disabled>
                Seleccionar categoría
              </option>
              <option value="limpieza">Limpieza</option>
              <option value="reparacion">Reparación</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="otro">Otro</option>
            </Select>

            <Select
              label="Destino"
              id="id_ubicacion"
              name="id_ubicacion"
              required
              value={destinos}
              onChange={(e) => {
                if (e.target.value === "nuevo") {
                  router.push(`/user/${id}/solicitudNuevaUbicacion`);
                } else {
                  setDestinos(e.target.value);
                }
              }}
            >
              <option value="" disabled>
                Seleccionar destino
              </option>
              {ubicaciones.map((u) => (
                <option key={u.id_ubicacion} value={u.id_ubicacion}>
                  {u.calle} {u.numero}, {u.ciudad}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <BotonAgregarDestino id={id} />
          </div>

          <Textarea
            label="Descripción"
            id="descripcion"
            name="descripcion"
            required
            rows={4}
            placeholder="Describí el trabajo a realizar…"
          />

          <Select
            label="Descuento"
            id="descuento"
            name="descuento"
            value={descuentoId ?? ""}
            onChange={(e) => setDescuentoId(e.target.value || null)}
          >
            <option value="">Sin descuento</option>
            {DESCUENTOS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.codigo} — {d.valor}% de descuento
              </option>
            ))}
          </Select>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="foto"
              className="text-[12.5px] font-semibold text-rd-text-2 tracking-wide"
            >
              Adjuntar foto
            </label>
            <input
              id="foto"
              type="file"
              accept="image/*"
              multiple
              required
              className="w-full px-3.5 py-3 rounded-xl text-sm outline-none bg-rd-inset border border-rd-border-2 text-rd-text file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-rd-elevated file:text-rd-text-2 hover:file:bg-rd-surface focus:border-rd-accent transition-colors"
            />
          </div>

          {precio && (
            <div
              className="rounded-xl p-5 flex items-center justify-between gap-4 border border-rd-border-3"
              style={{ background: "var(--color-rd-accent-dim)" }}
            >
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-rd-accent-soft">
                  Monto estimado
                </div>
                {descuentoSeleccionado && (
                  <div className="text-[11.5px] text-rd-muted mt-1">
                    {precio.monto.toLocaleString("es-AR")} base ·{" "}
                    -{descuentoSeleccionado.valor}% descuento
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl sm:text-[28px] font-bold tabular-rd tracking-tight text-rd-text">
                  $ {montoFinal.toLocaleString("es-AR")}
                </div>
                {descuentoSeleccionado && (
                  <Pill tone="accent" size="sm" className="mt-1">
                    -{descuentoSeleccionado.valor}%{" "}
                    {descuentoSeleccionado.codigo}
                  </Pill>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/user/${id}/menu`)}
              className="sm:w-auto"
            >
              Cancelar
            </Button>
            <BotonSolicitar />
          </div>
        </form>

        {/* Sidebar */}
        <aside className="rounded-2xl p-5 sm:p-6 bg-rd-surface border border-rd-border h-fit">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-rd-muted mb-4">
            ¿Cómo sigue?
          </div>
          <ol className="flex flex-col gap-3">
            {[
              { Icon: Search, label: "Buscamos un técnico cerca tuyo" },
              { Icon: User, label: "Un profesional acepta el trabajo" },
              { Icon: Truck, label: "Seguilo en tiempo real" },
              { Icon: CheckCircle2, label: "Confirmás conformidad y pagás" },
            ].map(({ Icon, label }, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-rd-elevated grid place-items-center text-rd-accent-soft shrink-0">
                  <Icon size={14} strokeWidth={1.75} />
                </span>
                <span className="text-[13px] text-rd-text-2">{label}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
