"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

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

export default function ViajesList({
    initialViajes,
    idCliente,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialViajes: any[];
    idCliente: number;
}) {
    const [viajes, setViajes] = useState<Viaje[]>(initialViajes as Viaje[]);

    // Sincronizar si el Server Component recarga
    useEffect(() => {
        setViajes(initialViajes);
    }, [initialViajes]);

    // Supabase Realtime: escucha cambios en viajes de este cliente
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (payload: any) => {
                    const { eventType, new: newRow, old: oldRow } = payload;

                    if (eventType === "INSERT") {
                        const nuevo = newRow as Viaje;
                        setViajes((prev) =>
                            prev.some((v) => v.id_viaje === nuevo.id_viaje)
                                ? prev
                                : [nuevo, ...prev]
                        );
                    } else if (eventType === "UPDATE") {
                        const actualizado = newRow as Viaje;
                        setViajes((prev) =>
                            prev.map((v) =>
                                v.id_viaje === actualizado.id_viaje
                                    ? { ...v, ...actualizado } // preserva pagos que no vienen en el payload
                                    : v
                            )
                        );
                    } else if (eventType === "DELETE") {
                        const eliminado = oldRow as { id_viaje: number };
                        setViajes((prev) =>
                            prev.filter((v) => v.id_viaje !== eliminado.id_viaje)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabaseBrowser.removeChannel(channel);
        };
    }, [idCliente]);

    if (viajes.length === 0) {
        return (
            <div className="py-32 text-center border-2 border-dashed border-brand-purple/10">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-brand-muted text-xl font-black uppercase tracking-widest opacity-30">
                    Sin registros
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-1 w-full">
            {viajes.map((viaje) => (
                <div
                    key={viaje.id_viaje}
                    className="group flex flex-col md:flex-row md:items-center justify-between gap-8 py-10 border-b border-brand-purple/10 hover:bg-brand-accent/5 px-4 transition-all duration-300"
                >
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 bg-brand-accent/10 text-brand-accent text-[10px] font-black uppercase tracking-widest border border-brand-accent/20">
                                {viaje.tipo_de_trabajo}
                            </span>
                            <span
                                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${
                                    viaje.estado === "completado"
                                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                }`}
                            >
                                {viaje.estado}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <p className="text-brand-muted font-bold text-xs uppercase tracking-widest">
                                FECHA:{" "}
                                {viaje.fecha
                                    ? new Date(viaje.fecha).toLocaleDateString("es-ES", {
                                          day: "2-digit",
                                          month: "long",
                                          year: "numeric",
                                      })
                                    : "N/A"}
                            </p>
                            {viaje.driver && (
                                <p className="text-brand-text font-bold text-sm uppercase tracking-tighter flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-brand-accent" />
                                    Driver:{" "}
                                    <span className="text-brand-lavender">{viaje.driver}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-1">
                        {viaje.pagos?.[0] && (
                            <div className="text-left md:text-right">
                                <p className="text-2xl font-black text-brand-text tracking-tighter tabular-nums">
                                    ${Number(viaje.pagos[0].monto).toLocaleString("es-AR")}
                                </p>
                                <p className="text-[10px] text-brand-purple font-black uppercase tracking-[0.4em] ml-1 md:ml-0">
                                    {viaje.pagos[0].estado}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
