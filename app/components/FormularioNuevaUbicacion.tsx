"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Save } from "lucide-react";
import { nuevaUbicacion } from "@/lib/actions/nuevaUbicacion";
import { PageHeader, Input, Button } from "@/app/components/ui";

export default function FormularioNuevaUbicacion({ id }: { id: string }) {
  const router = useRouter();

  return (
    <div className="py-2 sm:py-4 max-w-4xl mx-auto w-full">
      <button
        type="button"
        onClick={() => router.push(`/user/${id}/solicitudTrabajoActual`)}
        className="inline-flex items-center gap-1 text-sm text-rd-text-2 hover:text-rd-text transition-colors mb-3"
      >
        <ChevronLeft size={16} strokeWidth={1.75} />
        Volver
      </button>

      <PageHeader
        eyebrow="Cliente · Direcciones"
        title="Nueva ubicación"
        description="Validamos contra Nominatim (OpenStreetMap) antes de guardar."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <form
          action={nuevaUbicacion}
          className="rounded-2xl p-5 sm:p-6 bg-rd-surface border border-rd-border-2 flex flex-col gap-4"
        >
          <input type="hidden" name="id" value={id} />

          <Input
            label="Calle"
            name="calle"
            required
            placeholder="Ej. Av. Corrientes"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Número"
              name="numero"
              required
              placeholder="Ej. 4521"
              className="tabular-rd"
            />
            <Input
              label="Ciudad"
              name="ciudad"
              required
              placeholder="Ej. CABA, Argentina"
              defaultValue="CABA, Argentina"
            />
          </div>

          <p className="text-xs text-rd-muted leading-relaxed">
            Si la dirección no se encuentra, recibirás una notificación.
            Direcciones duplicadas se ignoran.
          </p>

          <div className="flex flex-col-reverse sm:flex-row gap-3 mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                router.push(`/user/${id}/solicitudTrabajoActual`)
              }
            >
              Cancelar
            </Button>
            <Button type="submit" fullWidth>
              <Save size={16} strokeWidth={1.75} />
              Guardar ubicación
            </Button>
          </div>
        </form>

        <aside className="rounded-2xl p-6 bg-rd-bg-2 border border-rd-border flex flex-col items-center justify-center text-center min-h-[200px]">
          <div className="w-14 h-14 rounded-xl bg-rd-elevated grid place-items-center text-rd-accent-soft mb-4">
            <MapPin size={26} strokeWidth={1.75} />
          </div>
          <h3 className="font-bold text-rd-text">Validación con OpenStreetMap</h3>
          <p className="text-xs text-rd-muted leading-relaxed mt-1.5 max-w-[280px]">
            Verificamos la dirección contra Nominatim para asegurar que el
            técnico te encuentre.
          </p>
        </aside>
      </div>
    </div>
  );
}
