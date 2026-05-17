import { Suspense } from "react";
import { obtenerTodosLosClientes } from "@/lib/actions/clientes";
import ListaClientes from "./_components/ListaClientes";
import { PageHeader } from "@/app/components/ui";

async function AdminClientsData() {
  const clientes = await obtenerTodosLosClientes();
  return <ListaClientes initialClients={clientes} />;
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
