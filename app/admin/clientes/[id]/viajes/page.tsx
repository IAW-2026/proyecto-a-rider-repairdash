import { getViajesCliente } from "@/lib/actions/viajes";
import { getClienteID } from "@/lib/actions/clientes";
import Link from "next/link";

export default async function ClienteViajesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cliente = await getClienteID(id);
    const viajes = await getViajesCliente(parseInt(id));

    if (!cliente) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center text-brand-text w-full">
                <div className="text-center space-y-6">
                    <p className="text-3xl font-black">Cliente no encontrado</p>
                    <Link href="/admin" className="px-8 py-3 bg-brand-accent text-white rounded-full font-bold shadow-lg shadow-brand-accent/30 hover:scale-105 transition-all">
                        Volver al panel
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-brand-bg text-brand-text p-4 sm:p-8 lg:p-12 w-full">
            <div className="w-full space-y-12">
                <header className="flex items-center gap-6 py-4">
                    <Link href="/admin" className="w-14 h-14 rounded-2xl bg-brand-surface border border-brand-purple/30 flex items-center justify-center hover:border-brand-accent transition-all shadow-xl text-2xl">
                        ⬅️
                    </Link>
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-brand-accent to-brand-lavender bg-clip-text text-transparent">
                            Historial de {cliente.nombre}
                        </h1>
                        <p className="text-brand-muted text-lg font-medium">{cliente.mail}</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                    {viajes.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-brand-surface rounded-[2.5rem] border-2 border-dashed border-brand-purple/20">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-brand-muted text-xl font-medium">Este cliente aún no tiene registros de viajes.</p>
                        </div>
                    ) : (
                        viajes.map((viaje: any) => (
                            <div key={viaje.id_viaje} className="bg-brand-surface border border-brand-purple/20 rounded-[2rem] p-8 flex flex-col justify-between gap-8 hover:border-brand-accent/40 transition-all shadow-xl group">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-4 py-1.5 rounded-full bg-brand-accent/20 text-brand-accent text-[10px] font-black uppercase tracking-widest border border-brand-accent/30">
                                            {viaje.tipo_de_trabajo}
                                        </span>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            viaje.estado === "completado" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                        }`}>
                                            {viaje.estado}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-brand-muted font-bold text-xs uppercase tracking-tighter">
                                            FECHA: {viaje.fecha ? new Date(viaje.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : "N/A"}
                                        </p>
                                        {viaje.driver && (
                                            <p className="text-brand-text font-medium flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-brand-purple" />
                                                Driver: <span className="text-brand-lavender font-bold">{viaje.driver}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-start gap-2 pt-4 border-t border-brand-purple/10">
                                    {viaje.pagos?.[0] && (
                                        <div>
                                            <p className="text-4xl font-black text-brand-text tracking-tighter">${Number(viaje.pagos[0].monto).toLocaleString('es-AR')}</p>
                                            <p className="text-[10px] text-brand-purple font-black uppercase tracking-[0.3em]">{viaje.pagos[0].estado}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
