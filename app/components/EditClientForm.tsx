"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { actualizarClienteAction } from "@/lib/actions/clientes";
import {
  Input,
  Avatar,
  Stars,
  Button,
} from "@/app/components/ui";

type Cliente = {
  id_cliente: number;
  nombre?: string | null;
  apellido?: string | null;
  mail: string;
  id_clerk?: string | null;
  calificacion?: number | string | null;
};

export default function EditClientForm({ cliente }: { cliente: Cliente }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: cliente.nombre || "",
    apellido: cliente.apellido || "",
    mail: cliente.mail || "",
    calificacion: Number(cliente.calificacion ?? 0),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await actualizarClienteAction(cliente.id_cliente, formData);
      toast.success("Perfil actualizado", {
        description: "Los cambios se guardaron en la base de datos.",
      });
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Error al actualizar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  const fullName = `${formData.nombre} ${formData.apellido}`.trim() || "Cliente";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-5 lg:gap-6">
      {/* Identity card */}
      <aside className="rounded-2xl p-6 sm:p-7 bg-rd-surface border border-rd-border flex flex-col items-center text-center h-fit">
        <Avatar name={fullName} size={96} />
        <h2 className="text-xl font-bold tracking-tight text-rd-text mt-4">
          {fullName}
        </h2>
        <p className="text-xs text-rd-muted mt-1">
          cliente · #{cliente.id_cliente}
        </p>

        <div className="w-full mt-5 pt-5 border-t border-rd-border-2 text-xs text-rd-muted">
          <div className="flex justify-between py-1 items-center">
            <span>id_clerk</span>
            <span className="font-mono-rd text-rd-text-2 truncate max-w-[180px]">
              {cliente.id_clerk ? cliente.id_clerk : "—"}
            </span>
          </div>
          <div className="flex justify-between py-1 items-center">
            <span>Calificación</span>
            <span className="inline-flex items-center gap-1.5 text-rd-text-2">
              <Stars value={Number(cliente.calificacion ?? 0)} size={11} />
              {Number(cliente.calificacion ?? 0).toFixed(1)}
            </span>
          </div>
        </div>
      </aside>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 sm:p-7 bg-rd-surface border border-rd-border flex flex-col gap-5"
      >
        <h3 className="font-bold text-rd-text">Datos personales</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Nombre"
            required
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />
          <Input
            label="Apellido"
            required
            value={formData.apellido}
            onChange={(e) =>
              setFormData({ ...formData, apellido: e.target.value })
            }
          />
        </div>

        <Input
          label="Email"
          type="email"
          disabled
          value={formData.mail}
          helperText="El email se gestiona desde la consola de Clerk."
        />

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3 items-end">
          <Input
            label="Calificación"
            type="number"
            min={0}
            max={5}
            step={0.1}
            className="tabular-rd"
            value={formData.calificacion}
            onChange={(e) =>
              setFormData({
                ...formData,
                calificacion: parseFloat(e.target.value) || 0,
              })
            }
          />
          <div className="flex items-center gap-3 px-4 h-12 rounded-xl bg-rd-bg-2 border border-rd-border">
            <Stars value={formData.calificacion} size={16} />
            <span className="tabular-rd text-sm font-semibold text-rd-text">
              {formData.calificacion.toFixed(1)}
              <span className="text-rd-muted font-normal"> / 5</span>
            </span>
          </div>
        </div>

        <hr className="border-rd-border-2" />

        <div>
          <h3 className="font-bold text-rd-text mb-1">Zona peligrosa</h3>
          <p className="text-xs text-rd-muted mb-3">
            Eliminar el cliente borra sus viajes, pagos, ubicaciones y
            promociones en cascada. La eliminación se ejecuta desde el listado
            principal.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/admin")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 size={16} strokeWidth={2} className="animate-spin" />
            ) : (
              <Save size={16} strokeWidth={1.75} />
            )}
            {loading ? "Guardando…" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
