import TablaViajes from "@/app/components/TablaViajes";

export default async function Travels({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-text">
          Trabajos realizados
        </h1>
        <p className="mt-2 text-base text-brand-purple">
          Historial de todos tus servicios técnicos.
        </p>
      </div>
      <TablaViajes id={id} />
    </div>
  );
}