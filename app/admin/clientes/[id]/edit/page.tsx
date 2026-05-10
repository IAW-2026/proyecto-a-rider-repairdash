import { getClienteID } from "@/lib/actions/clientes";
import EditClientForm from "@/app/components/EditClientForm";
import Link from "next/link";

export default async function EditClientePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cliente = await getClienteID(id);

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
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-brand-accent to-brand-purple bg-clip-text text-transparent">
                            Perfil de Usuario
                        </h1>
                        <p className="text-brand-muted text-lg font-medium">Editando a {cliente.nombre} {cliente.apellido}</p>
                    </div>
                </header>

                <div className="w-full">
                    <EditClientForm cliente={cliente} />
                </div>

                <div className="w-full bg-brand-purple/5 border border-brand-purple/20 rounded-[2.5rem] p-8 text-sm text-brand-lavender leading-relaxed flex items-start gap-4">
                    <span className="text-3xl shrink-0">🛡️</span>
                    <div>
                        <h4 className="font-bold text-lg mb-2">Información de Seguridad</h4>
                        <p>
                            Estás modificando datos directos en la base de datos de <strong>RepairDash</strong>. 
                            Recuerda que la sincronización con Clerk es automática para el ID, pero los correos y contraseñas 
                            principales deben gestionarse desde la consola externa por razones de seguridad y privacidad.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
