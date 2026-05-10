"use client";

import { useState } from "react";
import { actualizarClienteAction } from "@/lib/actions/clientes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditClientForm({ cliente }: { cliente: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: cliente.nombre || "",
        apellido: cliente.apellido || "",
        mail: cliente.mail || "",
        calificacion: cliente.calificacion || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await actualizarClienteAction(cliente.id_cliente, formData);
            toast.success("Perfil actualizado con éxito", {
                description: "Los cambios se han guardado en la base de datos."
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

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <label className="block text-sm font-black uppercase tracking-[0.3em] text-brand-accent ml-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full bg-brand-surface border border-brand-purple/20 rounded-2xl px-8 py-6 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all shadow-xl text-lg"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                </div>
                <div className="space-y-4">
                    <label className="block text-sm font-black uppercase tracking-[0.3em] text-brand-accent ml-1">
                        Apellido
                    </label>
                    <input
                        type="text"
                        required
                        className="w-full bg-brand-surface border border-brand-purple/20 rounded-2xl px-8 py-6 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all shadow-xl text-lg"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-black uppercase tracking-[0.3em] text-brand-muted ml-1">
                    Correo Electrónico
                </label>
                <div className="relative group">
                    <input
                        type="email"
                        disabled
                        className="w-full bg-brand-surface/50 border border-brand-purple/10 rounded-2xl px-8 py-6 text-brand-muted/40 cursor-not-allowed italic text-lg"
                        value={formData.mail}
                    />
                    <div className="absolute inset-y-0 right-8 flex items-center">
                        <span className="text-[10px] font-black text-brand-purple/30 tracking-[0.2em]">SISTEMA • READ ONLY</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-black uppercase tracking-[0.3em] text-brand-muted ml-1">
                    Reputación / Calificación del Cliente
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-10 bg-brand-surface/30 p-10 rounded-[2rem] border border-brand-purple/10">
                    <div className="flex-1 space-y-6 w-full">
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.1"
                            className="w-full accent-brand-accent h-3 bg-brand-bg rounded-full appearance-none cursor-pointer"
                            value={formData.calificacion}
                            onChange={(e) => setFormData({ ...formData, calificacion: parseFloat(e.target.value) })}
                        />
                        <div className="flex justify-between text-[10px] font-black text-brand-muted/50 uppercase tracking-widest">
                            <span>Baja</span>
                            <span>Media</span>
                            <span>Excelente</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0 bg-brand-bg px-8 py-5 rounded-3xl border border-brand-purple/20 shadow-2xl">
                        <span className="text-5xl font-black text-brand-accent tabular-nums">
                            {Number(formData.calificacion).toFixed(1)}
                        </span>
                        <span className="text-3xl">⭐</span>
                    </div>
                </div>
            </div>

            <div className="pt-10">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-24 bg-gradient-to-r from-brand-accent via-brand-purple to-brand-accent bg-[length:200%_auto] hover:bg-right text-white font-black text-2xl uppercase tracking-[0.4em] rounded-3xl shadow-[0_0_50px_rgba(245,0,241,0.2)] transition-all duration-700 disabled:opacity-50 active:scale-[0.97]"
                >
                    {loading ? "Sincronizando..." : "Confirmar Cambios"}
                </button>
            </div>
        </form>
    );
}
