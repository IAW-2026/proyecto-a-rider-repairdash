import { getViajes } from "@/lib/queries/viajes";
import { requireSuperAdmin } from "@/lib/api/superAdminAuth";

export async function GET(req: Request) {
  const denied = requireSuperAdmin(req);
  if (denied) return denied;

  const viajes = await getViajes();
  return new Response(JSON.stringify({ data: viajes }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
