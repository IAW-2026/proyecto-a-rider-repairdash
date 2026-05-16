"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Briefcase, Edit, Trash2, Loader2 } from "lucide-react";
import { eliminarClienteCompleto } from "@/lib/actions/clientes";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { Avatar, Pill, Stars, cn } from "@/app/components/ui";

interface Client {
  id_cliente: number;
  nombre: string | null;
  apellido: string | null;
  mail: string;
  id_clerk: string | null;
  calificacion: number | null;
}

export default function ClientList({
  initialClients,
}: {
  initialClients: Client[];
}) {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  useEffect(() => {
    const channel = supabaseBrowser
      .channel("admin-clientes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cliente" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          if (eventType === "INSERT") {
            const nuevo = newRow as Client;
            setClients((prev) =>
              prev.some((c) => c.id_cliente === nuevo.id_cliente)
                ? prev
                : [nuevo, ...prev],
            );
          } else if (eventType === "UPDATE") {
            const actualizado = newRow as Client;
            setClients((prev) =>
              prev.map((c) =>
                c.id_cliente === actualizado.id_cliente ? actualizado : c,
              ),
            );
          } else if (eventType === "DELETE") {
            const eliminado = oldRow as { id_cliente: number };
            setClients((prev) =>
              prev.filter((c) => c.id_cliente !== eliminado.id_cliente),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, []);

  const filteredClients = clients.filter(
    (c) =>
      (c.nombre?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (c.apellido?.toLowerCase() || "").includes(search.toLowerCase()) ||
      c.mail.toLowerCase().includes(search.toLowerCase()),
  );

  const executeDelete = async (id: number, clerkId?: string | null) => {
    setDeletingId(id);
    const promise = eliminarClienteCompleto(id, clerkId);

    toast.promise(promise, {
      loading: "Eliminando cliente…",
      success: () => {
        setClients((prev) => prev.filter((c) => c.id_cliente !== id));
        setDeletingId(null);
        return "Cliente eliminado correctamente de la base de datos y Clerk";
      },
      error: () => {
        setDeletingId(null);
        return "No se pudo eliminar al cliente.";
      },
    });
  };

  const confirmDelete = (
    id: number,
    nombre: string,
    clerkId?: string | null,
  ) => {
    toast(`¿Eliminar a ${nombre}?`, {
      description:
        "Esta acción borrará todos sus viajes y su cuenta de acceso de forma permanente.",
      action: {
        label: "Confirmar",
        onClick: () => executeDelete(id, clerkId),
      },
      cancel: { label: "Cancelar", onClick: () => {} },
      duration: 10000,
    });
  };

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex-1 max-w-md min-w-[240px]">
          <input
            type="text"
            placeholder="Filtrar por nombre o email…"
            className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-rd-inset border border-rd-border-2 text-rd-text placeholder:text-rd-subtle focus:border-rd-accent focus:bg-rd-bg focus:outline-none transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Pill tone="mute">{filteredClients.length} resultados</Pill>
      </div>

      {/* Desktop / tablet: tabla */}
      <div className="hidden md:block rounded-2xl overflow-hidden border border-rd-border bg-rd-surface">
        <table className="w-full border-collapse">
          <thead className="bg-rd-bg-2">
            <tr>
              {["Cliente", "Email", "Estado", "Calificación", "ID", ""].map(
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
            {filteredClients.map((c) => {
              const fullName = `${c.nombre ?? ""} ${c.apellido ?? ""}`.trim();
              return (
                <tr
                  key={c.id_cliente}
                  className="border-b border-rd-border last:border-b-0 hover:bg-rd-elevated/40 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={fullName || "Cliente"} size={36} online={!!c.id_clerk} />
                      <div className="min-w-0">
                        <div className="font-semibold text-[13.5px] text-rd-text truncate">
                          {fullName || "Sin nombre"}
                        </div>
                        <div className="font-mono-rd text-[11px] text-rd-muted">
                          cliente · activo
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-rd-text-2 truncate max-w-xs">
                    {c.mail}
                  </td>
                  <td className="px-4 py-3.5">
                    {c.id_clerk ? (
                      <Pill tone="ok" dot>
                        Clerk activo
                      </Pill>
                    ) : (
                      <Pill tone="warn" dot>
                        Sin sync
                      </Pill>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Stars value={Number(c.calificacion ?? 0)} size={12} />
                      <span className="tabular-rd text-[12.5px] text-rd-text-2">
                        {Number(c.calificacion ?? 0).toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono-rd text-[11.5px] text-rd-muted">
                    #{c.id_cliente}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <Link
                        href={`/admin/clientes/${c.id_cliente}/viajes`}
                        className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-[11px] font-semibold bg-rd-elevated text-rd-text-2 hover:bg-rd-surface hover:text-rd-text border border-rd-border-2 transition-colors"
                      >
                        <Briefcase size={13} strokeWidth={1.75} />
                        Viajes
                      </Link>
                      <Link
                        href={`/admin/clientes/${c.id_cliente}/edit`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rd-elevated text-rd-text-2 hover:bg-rd-surface hover:text-rd-text border border-rd-border-2 transition-colors"
                        aria-label="Editar"
                      >
                        <Edit size={13} strokeWidth={1.75} />
                      </Link>
                      <button
                        onClick={() =>
                          confirmDelete(
                            c.id_cliente,
                            fullName || "este cliente",
                            c.id_clerk,
                          )
                        }
                        disabled={deletingId === c.id_cliente}
                        className={cn(
                          "inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-colors",
                          "bg-rd-danger-bg border-rd-danger/30 text-rd-danger hover:border-rd-danger/50 disabled:opacity-50 disabled:cursor-not-allowed",
                        )}
                        aria-label="Eliminar"
                      >
                        {deletingId === c.id_cliente ? (
                          <Loader2
                            size={13}
                            strokeWidth={2}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={13} strokeWidth={1.75} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredClients.length === 0 && (
          <div className="py-16 text-center text-sm text-rd-muted">
            Sin resultados
          </div>
        )}
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden flex flex-col gap-2">
        {filteredClients.map((c) => {
          const fullName = `${c.nombre ?? ""} ${c.apellido ?? ""}`.trim();
          return (
            <div
              key={c.id_cliente}
              className="rounded-xl p-4 bg-rd-surface border border-rd-border"
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={fullName || "Cliente"} size={40} online={!!c.id_clerk} />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-rd-text truncate">
                    {fullName || "Sin nombre"}
                  </div>
                  <div className="text-[11.5px] text-rd-muted truncate">
                    {c.mail}
                  </div>
                </div>
                <span className="font-mono-rd text-[10.5px] text-rd-muted">
                  #{c.id_cliente}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {c.id_clerk ? (
                  <Pill tone="ok" size="sm">
                    Clerk
                  </Pill>
                ) : (
                  <Pill tone="warn" size="sm">
                    Sin sync
                  </Pill>
                )}
                <Pill tone="mute" size="sm">
                  ★ {Number(c.calificacion ?? 0).toFixed(1)}
                </Pill>
              </div>
              <div className="flex gap-1.5 mt-3">
                <Link
                  href={`/admin/clientes/${c.id_cliente}/viajes`}
                  className="flex-1 inline-flex items-center justify-center gap-1 h-9 rounded-lg text-xs font-semibold bg-rd-elevated text-rd-text-2 border border-rd-border-2"
                >
                  <Briefcase size={13} strokeWidth={1.75} /> Viajes
                </Link>
                <Link
                  href={`/admin/clientes/${c.id_cliente}/edit`}
                  className="flex-1 inline-flex items-center justify-center gap-1 h-9 rounded-lg text-xs font-semibold bg-rd-elevated text-rd-text-2 border border-rd-border-2"
                >
                  <Edit size={13} strokeWidth={1.75} /> Editar
                </Link>
                <button
                  onClick={() =>
                    confirmDelete(
                      c.id_cliente,
                      fullName || "este cliente",
                      c.id_clerk,
                    )
                  }
                  disabled={deletingId === c.id_cliente}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-rd-danger-bg border border-rd-danger/30 text-rd-danger"
                  aria-label="Eliminar"
                >
                  {deletingId === c.id_cliente ? (
                    <Loader2 size={13} strokeWidth={2} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
        {filteredClients.length === 0 && (
          <div className="py-12 text-center text-sm text-rd-muted">
            Sin resultados
          </div>
        )}
      </div>
    </div>
  );
}
