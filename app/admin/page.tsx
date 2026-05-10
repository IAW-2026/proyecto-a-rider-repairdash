import { obtenerTodosLosClientes } from "@/lib/actions/clientes";
import ClientList from "@/app/components/ClientList";
import Link from "next/link";

export default async function AdminPage() {
    const clientes = await obtenerTodosLosClientes();

    return (
        <main className="min-h-screen bg-brand-bg text-brand-text p-4 sm:p-6 lg:p-8 w-full">
            <div className="w-full space-y-12">
                {/* Header Section - Sin fondos ni bordes (globos) */}
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="w-12 h-12 rounded-2xl bg-brand-surface border border-brand-purple/30 flex items-center justify-center hover:border-brand-accent transition-all shadow-lg text-2xl">
                                🏠
                            </Link>
                            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter bg-gradient-to-r from-brand-accent via-brand-lavender to-brand-purple bg-clip-text text-transparent">
                                Panel de Clientes
                            </h1>
                        </div>
                        <p className="text-brand-muted text-xl font-medium ml-1">
                            Visualización completa de usuarios con rol de cliente.
                        </p>
                    </div>
                    
                    {/* Contador sin el contenedor "globo" */}
                    <div className="flex items-center gap-10">
                        <div className="text-center">
                            <span className="block text-5xl font-black text-brand-accent tabular-nums">{clientes.length}</span>
                            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-brand-muted/80">Clientes Listados</span>
                        </div>
                    </div>
                </header>

                {/* Main Content - Full Width */}
                <section className="relative w-full">
                    {/* Background Decorative Elements */}
                    <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-brand-accent/5 rounded-full blur-[150px] pointer-events-none animate-pulse" />
                    <div className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] bg-brand-purple/5 rounded-full blur-[150px] pointer-events-none animate-pulse" />

                    <div className="w-full">
                        <ClientList initialClients={clientes} />
                    </div>
                </section>
            </div>
        </main>
    );
}