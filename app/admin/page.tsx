import { Suspense } from "react";
import { obtenerTodosLosClientes } from "@/lib/actions/clientes";
import ClientList from "@/app/components/ClientList";
import { PageHeader } from "@/app/components/ui";

async function AdminClientsData() {
  const clientes = await obtenerTodosLosClientes();
  return <ClientList initialClients={clientes} />;
}

export default function AdminPage() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Admin · Gestión"
        size="large"
        title="Panel de clientes"
        description="Visualización completa de usuarios con rol de cliente."
      />
      <Suspense fallback={<div className="py-12 text-center text-sm text-rd-muted animate-pulse">Cargando base de datos...</div>}>
        <AdminClientsData />
      </Suspense>
    </div>
  );
}
