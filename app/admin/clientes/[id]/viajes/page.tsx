import { getViajesCliente } from "@/lib/actions/viajes";
import { getClienteID } from "@/lib/actions/clientes";
import Link from "next/link";
import ViajesList from "@/app/components/ViajesList";

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


                <ViajesList initialViajes={viajes} idCliente={parseInt(id)} />
            </div>
        </main>
    );
}
