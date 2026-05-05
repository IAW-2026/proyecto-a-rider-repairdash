"use client"

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { nuevoTrabajo } from "@/app/sync/nuevoTrabajo";

const PRECIOS: Record<string, { monto: number }> = {
  limpieza: { monto: 5000 },
  reparacion: { monto: 15000 },
  mantenimiento: { monto: 8000 },
  otro: { monto: 3000 },
};

function PrecioconDescuento(monto: number, descuento: number) {
  return monto- (monto * descuento / 100);
}

export default function SolicitudTrabajoActual() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [categoria, setCategoria] = useState("");
  const precio = PRECIOS[categoria] ?? null;

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-text">
          Nuevo trabajo
        </h1>
        <p className="mt-2 text-base text-brand-purple">
          Completá los datos de tu solicitud de servicio.
        </p>
      </div>

      <div className="rounded-2xl p-6 bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-md">
          <form className="flex flex-col gap-5" action={nuevoTrabajo}>
          <input type="hidden" name="id" value={id} />

          {/* Categoría */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-brand-lavender">Categoría</label>
            <select
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

          {/*Descuento*/}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-brand-lavender">¿Tienes descuento?</label>
            <input type="text" name="descuento" className="w-full px-5 py-3.5 rounded-xl text-base outline-none transition-all bg-brand-bg border border-brand-purple text-brand-text focus:border-brand-accent" placeholder="Codigo de descuento" />
          </div>
          {/*Consultar codigo de descuento y modificar el precio segun lo que sea el descuento, de no existir el codigo no se aplica ningun descuento*/ }
          {/*descuento = fetch (app/promotions/codigo), hardcodeo el descuento a 0 por ahora*/}
          

            
          {/* Monto calculado — aparece al seleccionar una categoría */}
          {precio && (
            <div className="rounded-xl p-5 flex items-center justify-between gap-4 bg-[linear-gradient(135deg,#F500F110,#8D62A515)] border border-brand-accent/30">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-1">
                  Monto estimado
                </p>
              </div>
              <p className="text-3xl font-extrabold text-brand-text shrink-0">
                ${PrecioconDescuento(precio.monto, 0).toLocaleString("es-AR")}
              </p>
            </div>
          )}
          
          {/* Input oculto seguro para enviar al backend (solo si hay precio y en formato crudo, no localizado) */}
          <input type="hidden" name="monto" value={precio ? PrecioconDescuento(precio.monto, 0) : 0} />
          
          {/*Adjuntar foto*/}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-brand-lavender">Adjuntar foto</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="w-full px-5 py-3.5 rounded-xl text-base outline-none transition-all bg-brand-bg border border-brand-purple text-brand-text focus:border-brand-accent"
              required
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-brand-lavender">Descripción</label>
            <input
              type="text"
              name="descripcion"
              placeholder="Describí el trabajo a realizar..."
              required
              className="w-full px-5 py-3.5 rounded-xl text-base outline-none transition-all bg-brand-bg border border-brand-purple text-brand-text focus:border-brand-accent"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl font-bold text-base tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-95 bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-brand-text shadow-[0_0_16px_#F500F150]"
            >
              Solicitar
            </button>
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