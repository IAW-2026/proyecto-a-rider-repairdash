import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Verificando invariantes pre-migración...\n");

  const sinClerk = (await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS c FROM cliente WHERE id_clerk IS NULL OR id_clerk = ''`
  )) as { c: number }[];
  console.log(
    `Clientes con id_clerk NULL o vacío: ${sinClerk[0].c}  ${
      sinClerk[0].c === 0 ? "OK" : "BLOQUEANTE"
    }`
  );

  const duplicados = (await prisma.$queryRawUnsafe(
    `SELECT id_clerk, COUNT(*)::int AS c FROM cliente
       WHERE id_clerk IS NOT NULL
       GROUP BY id_clerk HAVING COUNT(*) > 1`
  )) as any[];
  console.log(
    `Duplicados de id_clerk: ${duplicados.length}  ${
      duplicados.length === 0 ? "OK" : "BLOQUEANTE"
    }`
  );
  if (duplicados.length > 0) console.log(duplicados);

  const viajesHuerfanos = (await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS c FROM viajes
       WHERE id_cliente IS NOT NULL
         AND id_cliente NOT IN (SELECT id_cliente FROM cliente)`
  )) as { c: number }[];
  console.log(
    `Viajes huérfanos: ${viajesHuerfanos[0].c}  ${
      viajesHuerfanos[0].c === 0 ? "OK" : "WARN (quedarán con id_clerk NULL)"
    }`
  );

  const ubiHuerfanas = (await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS c FROM ubicacion
       WHERE id_cliente IS NOT NULL
         AND id_cliente NOT IN (SELECT id_cliente FROM cliente)`
  )) as { c: number }[];
  console.log(
    `Ubicaciones huérfanas: ${ubiHuerfanas[0].c}  ${
      ubiHuerfanas[0].c === 0 ? "OK" : "WARN (quedarán con id_clerk NULL)"
    }`
  );

  const totales = (await prisma.$queryRawUnsafe(
    `SELECT
       (SELECT COUNT(*)::int FROM cliente)   AS clientes,
       (SELECT COUNT(*)::int FROM viajes)    AS viajes,
       (SELECT COUNT(*)::int FROM ubicacion) AS ubicaciones,
       (SELECT COUNT(*)::int FROM pagos)     AS pagos`
  )) as any[];
  console.log(`\nConteos actuales:`, totales[0]);
}

main()
  .catch((e) => {
    console.error("Error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
