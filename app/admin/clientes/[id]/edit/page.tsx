import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getClienteID } from "@/lib/actions/clientes";
import EditClientForm from "@/app/components/EditClientForm";
import { PageHeader, Button } from "@/app/components/ui";

export default async function EditClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await getClienteID(id);

  if (!cliente) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <h2 className="text-2xl font-bold text-rd-text">
            Cliente no encontrado
          </h2>
          <p className="text-sm text-rd-muted">
            El cliente que buscás ya no existe o fue eliminado.
          </p>
          <Button href="/admin">Volver al panel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-rd-text-2 hover:text-rd-text transition-colors mb-3"
      >
        <ChevronLeft size={16} strokeWidth={1.75} />
        Volver a clientes
      </Link>

      <PageHeader
        eyebrow={`Admin · Cliente #${cliente.id_cliente}`}
        title="Editar cliente"
        description={`${cliente.nombre ?? ""} ${cliente.apellido ?? ""}`.trim()}
      />

      <EditClientForm cliente={cliente} />
    </div>
  );
}
