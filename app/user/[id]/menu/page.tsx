
import BotonNuevoTrabajo from "@/app/components/BotonNuevoTrabajo";

export default async function Menu({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="py-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-text">
          Menú principal
        </h1>
        <p className="mt-2 text-base text-brand-purple">
          ¿Qué querés hacer hoy?
        </p>
      </div>

      {/* Action card */}
      <div
        className="rounded-2xl p-6 flex flex-col gap-4 bg-brand-surface/60 border border-brand-purple/40 backdrop-blur-md"
      >
        <h2 className="text-xl font-bold text-brand-lavender">Nuevo trabajo</h2>
        <p className="text-base text-brand-purple">Creá una solicitud de servicio técnico.</p>
        <BotonNuevoTrabajo id={id} />
      </div>

      {/* Recent jobs section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4 text-brand-text">Últimos trabajos</h2>
        <div
          className="rounded-2xl p-6 text-center bg-brand-surface/40 border border-brand-purple/30"
        >
          <p className="text-base text-brand-purple">Aún no hay trabajos recientes.</p>
        </div>
      </div>
    </div>

    
  );
}