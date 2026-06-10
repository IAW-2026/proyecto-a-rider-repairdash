"use client";

import { useState, useRef } from "react";
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
  Plus,
  X,
} from "lucide-react";
import BotonAgregarDestino from "./BotonAgregarDestino";
import { distribuirFormulario } from "@/lib/actions/distribuirFormulario";
import { compressImage } from "@/lib/utils/compressImage";
import { PageHeader, Select, Textarea, Button, Pill } from "@/app/components/ui";

type Ubicacion = {
  id_ubicacion: number | string;
  calle: string;
  numero: number | string;
  ciudad: string;
};

type TipoServicio = {
  id: string;
  nombre: string;
  precioBase: number;
};

type Descuento = {
  id: number;
  nombre: string;
  tipoDescuento: "$" | "%";
  valor: number;
  precioMinimo: number | null;
  categorias: string[];
};

function aplicarDescuento(monto: number, d: Descuento): number {
  if (d.tipoDescuento === "$") return Math.max(0, monto - d.valor);
  return monto - (monto * d.valor) / 100;
}

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
  tipos,
  descuentos,
  tipoServicioIdInicial,
}: {
  id: string;
  ubicaciones: Ubicacion[];
  tipos: TipoServicio[];
  descuentos: Descuento[];
  tipoServicioIdInicial?: string;
}) {
  const router = useRouter();
  const [tipoServicioId, setTipoServicioId] = useState(
    tipoServicioIdInicial ?? "",
  );
  const [destinos, setDestinos] = useState("");
  const [fotos, setFotos] = useState<File[]>([]);
  const [fotoError, setFotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotos((prev) => {
      if (prev.length >= 3) return prev;
      const isDuplicate = prev.some(
        (f) => f.name === file.name && f.size === file.size,
      );
      if (isDuplicate) return prev;
      return [...prev, file];
    });
    e.target.value = "";
    setFotoError("");
  };

  const handleRemoveFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };
  const [descuentoId, setDescuentoId] = useState<number | null>(null);
  const tipoSeleccionado =
    tipos.find((t) => t.id === tipoServicioId) ?? null;
  const precio = tipoSeleccionado?.precioBase ?? null;

  const descuentosCompatibles = tipoSeleccionado
    ? descuentos.filter(
        (d) =>
          d.categorias.includes(tipoSeleccionado.id) &&
          (d.precioMinimo == null || (precio ?? 0) >= d.precioMinimo),
      )
    : [];

  const descuentoSeleccionado =
    descuentosCompatibles.find((d) => d.id === descuentoId) ?? null;
  const montoFinal =
    precio != null
      ? descuentoSeleccionado
        ? aplicarDescuento(precio, descuentoSeleccionado)
        : precio
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
          action={async (formData) => {
            if (fotos.length === 0) {
              setFotoError("Debés adjuntar al menos 1 foto.");
              return;
            }
            const comprimidas = await Promise.all(
              fotos.map((f) => compressImage(f)),
            );
            formData.delete("foto");
            for (const f of comprimidas) formData.append("foto", f);
            await distribuirFormulario(formData);
          }}
          className="rounded-2xl p-5 sm:p-7 bg-rd-surface border border-rd-border-2 flex flex-col gap-5"
        >
          <input
            type="hidden"
            name="montoSinDescuento"
            value={precio ?? 0}
          />
          <input
            type="hidden"
            name="montoConDescuento"
            value={montoFinal}
          />
          <input
            type="hidden"
            name="promocionId"
            value={descuentoSeleccionado?.id ?? ""}
          />
          <input
            type="hidden"
            name="categoria"
            value={tipoSeleccionado?.nombre ?? ""}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Categoría"
              id="tipoServicioId"
              name="tipoServicioId"
              required
              value={tipoServicioId}
              onChange={(e) => setTipoServicioId(e.target.value)}
            >
              <option value="" disabled>
                Seleccionar categoría
              </option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
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
            value={descuentoId ?? ""}
            onChange={(e) =>
              setDescuentoId(e.target.value ? Number(e.target.value) : null)
            }
            disabled={!tipoSeleccionado || descuentosCompatibles.length === 0}
          >
            <option value="">
              {!tipoSeleccionado
                ? "Elegí primero una categoría"
                : descuentosCompatibles.length === 0
                  ? "Sin descuentos disponibles"
                  : "Sin descuento"}
            </option>
            {descuentosCompatibles.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre} —{" "}
                {d.tipoDescuento === "%"
                  ? `${d.valor}% off`
                  : `$${d.valor.toLocaleString("es-AR")} off`}
              </option>
            ))}
          </Select>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-rd-text-2 tracking-wide">
                Adjuntar fotos
              </span>
              <span className={`text-[11.5px] font-medium ${fotos.length === 0 ? "text-rd-muted" : "text-rd-accent-soft"}`}>
                {fotos.length} / 3
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAddFoto}
            />

            <div className="flex gap-2 flex-wrap">
              {fotos.map((foto, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-rd-border-2 shrink-0">
                  <img
                    src={URL.createObjectURL(foto)}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFoto(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}

              {fotos.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-rd-border-2 flex flex-col items-center justify-center gap-1 text-rd-muted hover:border-rd-accent hover:text-rd-accent-soft transition-colors shrink-0"
                >
                  <Plus size={18} />
                  <span className="text-[10px] font-semibold">Agregar</span>
                </button>
              )}
            </div>

            {fotoError ? (
              <p className="text-xs text-red-500">{fotoError}</p>
            ) : (
              <p className="text-xs text-rd-muted">Mínimo 1, máximo 3 fotos.</p>
            )}
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
                    {precio.toLocaleString("es-AR")} base ·{" "}
                    {descuentoSeleccionado.tipoDescuento === "%"
                      ? `-${descuentoSeleccionado.valor}%`
                      : `-$${descuentoSeleccionado.valor.toLocaleString("es-AR")}`}{" "}
                    descuento
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl sm:text-[28px] font-bold tabular-rd tracking-tight text-rd-text">
                  $ {montoFinal.toLocaleString("es-AR")}
                </div>
                {descuentoSeleccionado && (
                  <Pill tone="accent" size="sm" className="mt-1">
                    {descuentoSeleccionado.nombre}
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
