import { getViajesCliente } from "@/lib/actions/viajes";
import { getClienteID } from "@/lib/actions/clientes";
import Link from "next/link";
import  Refresh  from "@/app/components/refresh";

export default async function ClienteViajesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // Paralelismo para mejor LCP
    const [cliente, viajes] = await Promise.all([
        getClienteID(id),
        getViajesCliente(parseInt(id))
    ]);

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
                    <Link href="/admin" className="w-12 h-12 bg-brand-surface border border-brand-purple/30 flex items-center justify-center hover:border-brand-accent transition-all shadow-lg text-2xl">
                        ⬅️
                    </Link>
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-brand-accent to-brand-lavender bg-clip-text text-transparent">
                            Historial de {cliente.nombre}
                        </h1>
                        <p className="text-brand-muted text-lg font-medium">{cliente.mail}</p>
                    </div>
                </header>


                {/* Listado uno abajo del otro (Grid 1 columna) */}
                <div className="grid grid-cols-1 gap-1 w-full">
                    {viajes.length === 0 ? (
                        <div className="py-32 text-center border-2 border-dashed border-brand-purple/10">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-brand-muted text-xl font-black uppercase tracking-widest opacity-30">Sin registros</p>
                        </div>
                    ) : (
                        viajes.map((viaje: any) => (
                            <div 
                                key={viaje.id_viaje} 
                                className="group flex flex-col md:flex-row md:items-center justify-between gap-8 py-10 border-b border-brand-purple/10 hover:bg-brand-accent/5 px-4 transition-all duration-300"
                            >
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="px-3 py-1 bg-brand-accent/10 text-brand-accent text-[10px] font-black uppercase tracking-widest border border-brand-accent/20">
                                            {viaje.tipo_de_trabajo}
                                        </span>
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${
                                            viaje.estado === "completado" 
                                            ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                        }`}>
                                            {viaje.estado}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <p className="text-brand-muted font-bold text-xs uppercase tracking-widest">
                                            FECHA: {viaje.fecha ? new Date(viaje.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : "N/A"}
                                        </p>
                                        {viaje.driver && (
                                            <p className="text-brand-text font-bold text-sm uppercase tracking-tighter flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-brand-accent" />
                                                Driver: <span className="text-brand-lavender">{viaje.driver}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-start md:items-end gap-1">
                                    {viaje.pagos?.[0] && (
                                        <div className="text-left md:text-right">
                                            <p className="text-2xl font-black text-brand-text tracking-tighter tabular-nums">
                                                ${Number(viaje.pagos[0].monto).toLocaleString('es-AR')}
                                            </p>
                                            <p className="text-[10px] text-brand-purple font-black uppercase tracking-[0.4em] ml-1 md:ml-0">
                                                {viaje.pagos[0].estado}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                               <Refresh />
            </div>
        </main>
    );
}
