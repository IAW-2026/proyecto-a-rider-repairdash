import { obtenerTodosLosClientes } from "@/lib/actions/clientes";
import ClientList from "@/app/components/ClientList";
import { PageHeader } from "@/app/components/ui";

export default async function AdminPage() {
  const clientes = await obtenerTodosLosClientes();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Admin · Gestión"
        title="Panel de clientes"
        description="Visualización completa de usuarios con rol de cliente."
      />
      <ClientList initialClients={clientes} />
    </div>
  );
}
