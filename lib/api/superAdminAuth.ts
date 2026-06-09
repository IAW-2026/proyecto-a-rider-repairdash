export function requireSuperAdmin(req: Request): Response | null {
  const expected = process.env.REPAIRDASH_API_KEY;
  const received = req.headers.get("x-api-key");

  if (!expected) return new Response("Internal Server Error", { status: 500 });
  if (received !== expected)
    return new Response("Unauthorized", { status: 401 });
  return null;
}

export function serializeCliente<T extends { calificacion?: unknown } | null>(
  cliente: T,
): T extends null ? null : T {
  if (!cliente) return null as never;
  return {
    ...(cliente as object),
    calificacion:
      (cliente as { calificacion?: unknown }).calificacion != null
        ? Number((cliente as { calificacion?: unknown }).calificacion)
        : null,
  } as never;
}
