"use client"

import { useRouter } from "next/navigation";
import { nuevaUbicacion } from "@/lib/actions/nuevaUbicacion";

export default function FormularioNuevaUbicacion({id}: {id: string}) {
  const router = useRouter();

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-text">
          Nueva Ubicación
        </h1>
        <p className="mt-2 text-base text-brand-purple">
          Registrá una nueva dirección para tus servicios.
        </p>
      </div>

      <div className="rounded-2xl p-6 bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-md">
        <form className="flex flex-col gap-5" action={nuevaUbicacion}>
          <input type="hidden" name="id" value={id} />

          {/* Calle */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-brand-lavender">Calle</label>
            <input
              type="text"
              name="calle"
              required
              placeholder="Ej. Av. Siempreviva"
              className="w-full px-5 py-3.5 rounded-xl text-base outline-none transition-all bg-brand-bg border border-brand-purple text-brand-text focus:border-brand-accent"
            />
          </div>

          {/* Número */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-brand-lavender">Número</label>
            <input
              type="text"
              name="numero"
              required
              placeholder="Ej. 742"
              className="w-full px-5 py-3.5 rounded-xl text-base outline-none transition-all bg-brand-bg border border-brand-purple text-brand-text focus:border-brand-accent"
            />
          </div>

          {/* Ciudad */}
          <div className="flex flex-col gap-1">
            <label className="text-base font-semibold text-brand-lavender">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              required
              placeholder="Ej. Springfield"
              className="w-full px-5 py-3.5 rounded-xl text-base outline-none transition-all bg-brand-bg border border-brand-purple text-brand-text focus:border-brand-accent"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="flex-1 py-3.5 rounded-xl font-bold text-base tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-95 bg-[linear-gradient(135deg,var(--color-brand-accent),var(--color-brand-purple))] text-brand-text shadow-[0_0_16px_#F500F150]"
            >
              Guardar Ubicación
            </button>
            <button
              type="button"
              onClick={() => router.push(`/user/${id}/solicitudTrabajoActual`)}
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
