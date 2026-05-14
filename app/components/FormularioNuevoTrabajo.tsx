"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { PRECIOS, PrecioconDescuento } from "@/lib/services/pricing";
import BotonAgregarDestino from "./BotonAgregarDestino";
import DistribuirFormulario from "./DistribuirFormulario";

// Mapeo de descuentos disponibles para el usuario.
// En el futuro se obtendrán desde el microservicio de promotions.
const DESCUENTOS: any[] = [
  { id: "001", codigo: "DESC001", valor: 10 },
  { id: "002", codigo: "DESC002", valor: 20 },
  { id: "003", codigo: "DESC003", valor: 30 },
  { id: "004", codigo: "DESC004", valor: 40 },
  { id: "005", codigo: "DESC005", valor: 50 },
];

/** Botón submit que se deshabilita y muestra "Cargando..." mientras el formulario procesa */
function BotonSolicitar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base tracking-wide transition-all duration-200
                 bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-brand-text shadow-[0_0_16px_#F500F150]
                 hover:scale-[1.02] active:scale-95
                 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Cargando...
        </>
      ) : (
        "Solicitar"
      )}
    </button>
  );
}

export default function FormularioNuevoTrabajo({id, ubicaciones}: {id: string, ubicaciones: any[]}) {
  const router = useRouter();
  const [categoria, setCategoria] = useState("");
  const [destinos, setDestinos] = useState("");
  const [descuentoId, setDescuentoId] = useState<string | null>(null);
  const precio = PRECIOS[categoria] ?? null;
  const descuentoSeleccionado = DESCUENTOS.find((d) => d.id === descuentoId) ?? null;
  const montoFinal = precio ? PrecioconDescuento(precio.monto, descuentoSeleccionado?.valor ?? 0) : 0;

  //consultar trabajos y precios a driver
  //validar codigos de descuento del cliente a promotions y una vez usado se elimina el codigo en la base de datos
  //enviar el formulario al driver
  //crear el pago y redirigirlo a payment

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-text">
          Nuevo trabajo
        </h1>
        <p className="mt-2 text-base text-brand-lavender">
          Completá los datos de tu solicitud de servicio.
        </p>
      </div>

      <div className="rounded-2xl p-6 bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-md">
        <form className="flex flex-col gap-5" action={DistribuirFormulario}>
          <input type="hidden" name="id" value={id} />

          {/* Categoría */}
          <div className="flex flex-col gap-1">
            <label htmlFor="categoria" className="text-base font-semibold text-brand-lavender">Categoría</label>
            <select
              id="categoria"
              name="categoria"
              required
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl text-base outline-none appearance-none cursor-pointer bg-brand-bg border border-brand-purple text-brand-text focus:border-brand-accent transition-colors"
            >
              <option value="" disabled>Seleccionar categoría</option>
              <option value="limpieza">Limpieza</option>
              <option value="reparacion">Reparación</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Destinos */}
          <div className="flex flex-col gap-1">
            <label htmlFor="id_ubicacion" className="text-base font-semibold text-brand-lavender">Destinos</label>
            <select
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
              className="w-full px-5 py-3.5 rounded-xl text-base outline-none appearance-none cursor-pointer bg-brand-bg border border-brand-purple text-brand-text focus:border-brand-accent transition-colors"
            >
              <option value="" disabled>Seleccionar destino</option>
              {ubicaciones.map((ubicacion) => (
                <option key={ubicacion.id_ubicacion} value={ubicacion.id_ubicacion}>
                  {ubicacion.calle} {ubicacion.numero}, {ubicacion.ciudad}
                </option>
              ))}
            </select>
            <div className="mt-2 flex">
              <BotonAgregarDestino id={id}/>
            </div>
          </div>

          {/* Descuentos disponibles */}
          <div className="flex flex-col gap-1">
            <label htmlFor="descuento" className="text-base font-semibold text-brand-lavender">Descuento</label>
            <select
              id="descuento"
              name="descuento"
              value={descuentoId ?? ""}
              onChange={(e) => setDescuentoId(e.target.value || null)}
              className="w-full px-5 py-3.5 rounded-xl text-base outline-none appearance-none cursor-pointer bg-brand-bg border border-brand-purple text-brand-text focus:border-brand-accent transition-colors"
            >
              <option value="">Sin descuento</option>
              {DESCUENTOS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.codigo} — {d.valor}% de descuento
                </option>
              ))}
            </select>
          </div>

          {/* Monto calculado */}
          {precio && (
            <div className="rounded-xl p-5 flex items-center justify-between gap-4 bg-[linear-gradient(135deg,#F500F110,#8D62A515)] border border-brand-accent/30">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-1">
                  Monto estimado
                </p>
              </div>
              <p className="text-3xl font-extrabold text-brand-text shrink-0">
                ${montoFinal.toLocaleString("es-AR")}
                {descuentoSeleccionado && (
                  <span className="ml-2 text-sm font-semibold text-brand-accent">-{descuentoSeleccionado.valor}%</span>
                )}
              </p>
            </div>
          )}

          <input type="hidden" name="monto" value={montoFinal} />

          {/* Adjuntar foto */}
          <div className="flex flex-col gap-1">
            <label htmlFor="foto" className="text-base font-semibold text-brand-lavender">Adjuntar foto</label>
            <input
              id="foto"
              type="file"
              accept="image/*"
              multiple
              className="w-full px-5 py-3.5 rounded-xl text-base outline-none transition-all bg-brand-bg border border-brand-purple text-brand-text focus:border-brand-accent"
              required
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1">
            <label htmlFor="descripcion" className="text-base font-semibold text-brand-lavender">Descripción</label>
            <input
              id="descripcion"
              type="text"
              name="descripcion"
              placeholder="Describí el trabajo a realizar..."
              required
              className="w-full px-5 py-3.5 rounded-xl text-base outline-none transition-all bg-brand-bg border border-brand-purple text-brand-text focus:border-brand-accent"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-2">
            <BotonSolicitar />
            <button
              type="button"
              onClick={() => router.push(`/user/${id}/menu`)}
              className="flex-1 py-3.5 rounded-xl font-bold text-base tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-95 bg-transparent border border-brand-purple text-brand-lavender hover:border-brand-accent hover:text-brand-text"
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}