import Link from "next/link";
import { ChevronLeft, Edit } from "lucide-react";
import { getViajesCliente } from "@/lib/actions/viajes";
import { getClienteByClerkID } from "@/lib/queries/clientes";
import ListaViajes from "./_components/ListaViajes";
import { PageHeader, Button, Avatar } from "@/app/components/ui";

export default async function ClienteViajesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [cliente, viajes] = await Promise.all([
    getClienteByClerkID(id),
    getViajesCliente(id),
  ]);

  if (!cliente) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <h2 className="text-2xl font-bold text-rd-text">
            Cliente no encontrado
          </h2>
          <Button href="/admin">Volver al panel</Button>
        </div>
      </div>
    );
  }

  const fullName = `${cliente.nombre ?? ""} ${cliente.apellido ?? ""}`.trim();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-rd-text-2 hover:text-rd-text transition-colors mb-3"
      >
        <ChevronLeft size={16} strokeWidth={1.75} />
        Volver a clientes
      </Link>

      <PageHeader
        eyebrow={`Admin · Cliente ${cliente.id_clerk.slice(-8)}`}
        title={`Historial de ${cliente.nombre ?? ""}`.trim()}
        description={cliente.mail}
        actions={
          <Button
            href={`/admin/clientes/${cliente.id_clerk}/edit`}
            variant="secondary"
          >
            <Edit size={15} strokeWidth={1.75} />
            Editar cliente
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 lg:gap-6">
        <ListaViajes initialViajes={viajes} idClerk={cliente.id_clerk} />

        <aside className="rounded-2xl p-5 sm:p-6 bg-rd-surface border border-rd-border h-fit">
          <div className="flex items-center gap-3.5">
            <Avatar name={fullName || "Cliente"} size={56} online={!!cliente.id_clerk} />
            <div className="min-w-0">
              <div className="font-bold text-rd-text truncate">{fullName}</div>
              <div className="text-[12px] text-rd-muted truncate">
                {cliente.mail}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
