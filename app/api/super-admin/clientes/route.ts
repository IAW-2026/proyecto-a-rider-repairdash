import { getClientes } from "@/lib/queries/clientes";
import { requireSuperAdmin, serializeCliente } from "@/lib/api/superAdminAuth";

export async function GET(req: Request) {
  const denied = requireSuperAdmin(req);
  if (denied) return denied;

  const clientes = await getClientes();
  const data = clientes.map((c) => serializeCliente(c));
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
