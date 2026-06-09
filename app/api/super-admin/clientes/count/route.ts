import { countClientes } from "@/lib/queries/clientes";
import { requireSuperAdmin } from "@/lib/api/superAdminAuth";

export async function GET(req: Request) {
  const denied = requireSuperAdmin(req);
  if (denied) return denied;

  const total = await countClientes();
  return new Response(JSON.stringify({ data: { total } }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
