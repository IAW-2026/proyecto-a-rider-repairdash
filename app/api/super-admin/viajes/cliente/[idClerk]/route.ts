import { getViajesByClerkID } from "@/lib/queries/viajes";
import { getClienteByClerkID } from "@/lib/queries/clientes";
import { requireSuperAdmin } from "@/lib/api/superAdminAuth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ idClerk: string }> },
) {
  const denied = requireSuperAdmin(req);
  if (denied) return denied;

  const { idClerk } = await params;
  const cliente = await getClienteByClerkID(idClerk);
  if (!cliente) {
    return new Response(JSON.stringify({ message: "Cliente no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const viajes = await getViajesByClerkID(idClerk);
  return new Response(JSON.stringify({ data: viajes }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
