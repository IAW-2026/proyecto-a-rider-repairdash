import {
  getClienteByClerkID,
  updateClienteByClerkID,
  deleteCliente,
} from "@/lib/queries/clientes";
import { requireSuperAdmin, serializeCliente } from "@/lib/api/superAdminAuth";

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
  return new Response(JSON.stringify({ data: serializeCliente(cliente) }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ idClerk: string }> },
) {
  const denied = requireSuperAdmin(req);
  if (denied) return denied;

  const { idClerk } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return new Response(JSON.stringify({ message: "Body inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data: { nombre?: string; apellido?: string } = {};
  if (typeof body.nombre === "string") data.nombre = body.nombre;
  if (typeof body.apellido === "string") data.apellido = body.apellido;

  if (Object.keys(data).length === 0) {
    return new Response(
      JSON.stringify({ message: "Debe enviarse al menos nombre o apellido" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const existente = await getClienteByClerkID(idClerk);
  if (!existente) {
    return new Response(JSON.stringify({ message: "Cliente no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const actualizado = await updateClienteByClerkID(idClerk, data);
  return new Response(JSON.stringify({ data: serializeCliente(actualizado) }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ idClerk: string }> },
) {
  const denied = requireSuperAdmin(req);
  if (denied) return denied;

  const { idClerk } = await params;
  const existente = await getClienteByClerkID(idClerk);
  if (!existente) {
    return new Response(JSON.stringify({ message: "Cliente no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  await deleteCliente(idClerk);
  return new Response(JSON.stringify({ message: "Cliente eliminado" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
