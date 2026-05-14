"use client";

import { useEffect, useState } from "react";
import { eliminarClienteCompleto } from "@/lib/actions/clientes";
import Link from "next/link";
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabaseClient";

interface Client {
    id_cliente: number;
    nombre: string | null;
    apellido: string | null;
    mail: string;
    id_clerk: string | null;
    calificacion: number | null;
}

export default function ClientList({ initialClients }: { initialClients: Client[] }) {
    const [clients, setClients] = useState(initialClients);
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Sincronizar si el server component recarga initialClients
    useEffect(() => {
        setClients(initialClients);
    }, [initialClients]);

    // Supabase Realtime: tabla cliente
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
                                : [nuevo, ...prev]
                        );
                    } else if (eventType === "UPDATE") {
                        const actualizado = newRow as Client;
                        setClients((prev) =>
                            prev.map((c) =>
                                c.id_cliente === actualizado.id_cliente ? actualizado : c
                            )
                        );
                    } else if (eventType === "DELETE") {
                        const eliminado = oldRow as { id_cliente: number };
                        setClients((prev) =>
                            prev.filter((c) => c.id_cliente !== eliminado.id_cliente)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabaseBrowser.removeChannel(channel);
        };
    }, []);

    const filteredClients = clients.filter(c =>
        (c.nombre?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (c.apellido?.toLowerCase() || "").includes(search.toLowerCase()) ||
        c.mail.toLowerCase().includes(search.toLowerCase())
    );

    const executeDelete = async (id: number, clerkId?: string | null) => {
        setDeletingId(id);
        const promise = eliminarClienteCompleto(id, clerkId);
        
        toast.promise(promise, {
            loading: 'Eliminando cliente...',
            success: () => {
                setClients(prev => prev.filter(c => c.id_cliente !== id));
                setDeletingId(null);
                return 'Cliente eliminado correctamente de la base de datos y Clerk';
            },
            error: () => {
                setDeletingId(null);
                return 'No se pudo eliminar al cliente.';
            },
        });
    };

    const confirmDelete = (id: number, nombre: string, clerkId?: string | null) => {
        toast(`¿Eliminar a ${nombre}?`, {
            description: "Esta acción borrará todos sus viajes y su cuenta de acceso de forma permanente.",
            action: {
                label: "Confirmar Borrado",
                onClick: () => executeDelete(id, clerkId),
            },
            cancel: {
                label: "Cancelar",
                onClick: () => {},
            },
            duration: 10000,
            className: "border-red-500/20 bg-brand-surface",
        });
    };
    
    return (
        <div className="w-full space-y-10">
            {/* Buscador Rectangular */}
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Filtrar por nombre o email..."
                    className="w-full bg-transparent border-b-2 border-brand-purple/20 px-4 py-6 text-2xl font-medium text-brand-text placeholder-brand-muted/30 focus:outline-none focus:border-brand-accent transition-all tabular-nums"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Listado Rectangular - Sin globos */}
            <div className="grid grid-cols-1 gap-1">
                {filteredClients.map((cliente) => (
                    <div 
                        key={cliente.id_cliente}
                        className="group flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-10 border-b border-brand-purple/10 hover:bg-brand-accent/5 px-4 transition-all duration-300"
                    >
                        <div className="flex items-center gap-8">
                            <div className="w-20 h-20 bg-brand-surface border border-brand-purple/30 flex items-center justify-center text-3xl font-black text-brand-accent shadow-2xl relative">
                                {cliente.nombre?.[0] || "👤"}
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-accent border-4 border-brand-bg rounded-full shadow-[0_0_10px_#F500F1]" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-black text-3xl text-brand-text tracking-tighter uppercase">
                                    {cliente.nombre} {cliente.apellido}
                                </h3>
                                <p className="text-lg text-brand-muted font-medium mb-4">{cliente.mail}</p>
                                <div className="flex flex-wrap gap-3">
                                    {cliente.id_clerk && (
                                        <span className="text-[10px] font-black bg-brand-accent/10 text-brand-accent px-3 py-1 border border-brand-accent/20 tracking-widest uppercase">
                                            CLERK • ACTIVE
                                        </span>
                                    )}
                                    <span className="text-[10px] font-black bg-brand-purple/10 text-brand-lavender px-3 py-1 border border-brand-purple/20 tracking-widest uppercase">
                                        ID: {cliente.id_cliente}
                                    </span>
                                    <span className="text-[10px] font-black bg-brand-bg text-brand-text px-3 py-1 border border-brand-purple/20 tracking-widest uppercase">
                                        ⭐ {Number(cliente.calificacion || 0).toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            {/* Botón Viajes */}
                            <Link 
                                href={`/admin/clientes/${cliente.id_cliente}/viajes`}
                                className="h-10 px-5 bg-brand-surface border border-brand-purple/20 text-brand-text text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-purple/20 hover:border-brand-accent transition-all group-hover:scale-105 shadow-lg"
                            >
                                <span>🚕</span>
                                <span>Viajes</span>
                            </Link>

                            {/* Botón Editar */}
                            <Link 
                                href={`/admin/clientes/${cliente.id_cliente}/edit`}
                                className="h-10 px-5 bg-brand-surface border border-brand-purple/20 text-brand-text text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-purple/20 hover:border-brand-accent transition-all group-hover:scale-105 shadow-lg"
                            >
                                <span>✏️</span>
                                <span>Editar</span>
                            </Link>

                            {/* Botón Eliminar */}
                            <button 
                                onClick={() => confirmDelete(cliente.id_cliente, cliente.nombre || "este cliente", cliente.id_clerk)}
                                disabled={deletingId === cliente.id_cliente}
                                className="h-10 px-5 bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all group-hover:scale-105 shadow-lg"
                            >
                                <span>{deletingId === cliente.id_cliente ? "⏳" : "🗑️"}</span>
                                <span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                ))}

                {filteredClients.length === 0 && (
                    <div className="text-center py-32 border-2 border-dashed border-brand-purple/10">
                        <p className="text-brand-muted text-2xl font-black uppercase tracking-widest opacity-30">Sin resultados</p>
                    </div>
                )}
            </div>
        </div>
    );
}
