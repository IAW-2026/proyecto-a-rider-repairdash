import Link from "next/link";

export default async function FeedbackPage({
    searchParams,
}: {
    searchParams: Promise<{ id_cliente?: string }>;
}) {
    const { id_cliente } = await searchParams;

    return (
        <main className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center py-6 px-safe-page">
            <div className="w-full max-w-md flex flex-col items-center gap-10 text-center">

                {/* Ícono animado */}
                <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-6xl shadow-[0_0_60px_#F500F130] animate-pulse">
                        📊
                    </div>
                    <span className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</span>
                </div>

                {/* Texto */}
                <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-accent">
                        Función en desarrollo
                    </p>
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-brand-accent to-brand-lavender bg-clip-text text-transparent">
                        Generar Reporte
                    </h1>
                    <p className="text-brand-muted text-lg font-medium leading-relaxed max-w-sm mx-auto">
                        Pronto podrás generar un reporte completo de tu historial de servicios.
                    </p>
                </div>

                {/* Badge Próximamente */}
                <div className="px-6 py-2 border border-brand-purple/30 bg-brand-surface/60 backdrop-blur text-brand-lavender text-sm font-black uppercase tracking-widest">
                    🚀 Próximamente
                </div>

                {/* Botón volver */}
                <Link
                    href={id_cliente ? `/user/${id_cliente}/menu` : "/"}
                    className="w-full max-w-xs py-4 bg-brand-accent text-white font-black text-sm uppercase tracking-widest text-center shadow-[0_0_30px_#F500F140] hover:shadow-[0_0_50px_#F500F180] hover:scale-105 transition-all duration-300"
                >
                    ← Volver al menú
                </Link>
            </div>
        </main>
    );
}
