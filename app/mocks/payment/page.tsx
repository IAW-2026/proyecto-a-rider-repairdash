import BotonAceptar from "./botonAceptar";
import BotonRachazar from "./botonRachazar";

interface Props {
  searchParams: Promise<{ id_viaje?: string; id_cliente?: string }>;
}

export default async function MockPaymentPage({ searchParams }: Props) {
  const { id_viaje, id_cliente } = await searchParams;
  const idViaje = id_viaje ? Number(id_viaje) : null;
  const idCliente = id_cliente ? Number(id_cliente) : null;

  // ✅ URL de destino DESPUÉS de que el usuario toca Aceptar o Rechazar
  // El redirect lo hace el BOTÓN, no la página
  const redirectUrl = idCliente ? `/user/${idCliente}/menu` : "/";

  return (
    <main className="relative min-h-screen bg-[#271033] flex items-center justify-center overflow-hidden">

      {/* ── Orbes de fondo ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#F500F1]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#8D62A5]/20 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-56 w-56 rounded-full bg-[#C392DD]/10 blur-2xl" />
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-[92vw] max-w-sm">

        {/* Borde superior degradado */}
        <div className="h-[3px] w-full rounded-t-2xl bg-gradient-to-r from-[#8D62A5] via-[#F500F1] to-[#C392DD]" />

        <div className="rounded-b-2xl border border-white/10 bg-[#3a1a4d]/70 backdrop-blur-xl px-8 py-10 shadow-2xl flex flex-col items-center gap-7">

          {/* Ícono */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F500F1]/10 border border-[#F500F1]/20 shadow-lg shadow-[#F500F1]/10">
            <svg className="h-8 w-8 text-[#F500F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
          </div>

          {/* Título */}
          <div className="text-center space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#C392DD]">
              Entorno de pruebas
            </p>
            <h1 className="text-2xl font-bold text-[#FBDAF9] leading-snug">
              Simulación de aceptación&nbsp;/&nbsp;rechazo del pago
            </h1>
            {idViaje && (
              <p className="text-sm text-[#C392DD]/70 pt-1">
                Viaje&nbsp;<span className="font-semibold text-[#FBDAF9]/80">#{idViaje}</span>
              </p>
            )}
          </div>

          {/* Divisor */}
          <div className="w-full border-t border-white/10" />

          {/* Botones o advertencia */}
          {idViaje ? (
            <div className="flex w-full flex-col gap-3">
              <BotonAceptar  idViaje={idViaje} redirectUrl={redirectUrl} />
              <BotonRachazar idViaje={idViaje} redirectUrl={redirectUrl} />
            </div>
          ) : (
            <p className="text-sm text-amber-400/80 text-center">
              ⚠️ Falta el parámetro&nbsp;<code className="bg-white/10 px-1 rounded">id_viaje</code>&nbsp;en la URL.<br />
              <span className="text-[#C392DD]/60 text-xs">Ej:&nbsp;/mocks/payment?id_viaje=5&amp;id_cliente=3</span>
            </p>
          )}

        </div>
      </div>
    </main>
  );
}
