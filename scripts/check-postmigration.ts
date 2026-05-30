import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Verificando estado post-migration...\n");

  const cols = (await prisma.$queryRawUnsafe(
    `SELECT table_name, column_name, data_type
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name IN ('cliente','viajes','ubicacion')
         AND column_name IN ('id_cliente','id_clerk')
       ORDER BY table_name, column_name`
  )) as any[];
  console.log("Columnas id_cliente/id_clerk por tabla:");
  console.table(cols);

  const fks = (await prisma.$queryRawUnsafe(
    `SELECT tc.table_name, tc.constraint_name, kcu.column_name,
            ccu.table_name AS ref_table, ccu.column_name AS ref_column
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu
         ON tc.constraint_name = kcu.constraint_name
       JOIN information_schema.constraint_column_usage ccu
         ON ccu.constraint_name = tc.constraint_name
       WHERE tc.constraint_type = 'FOREIGN KEY'
         AND tc.table_schema = 'public'
         AND tc.table_name IN ('viajes','ubicacion')
       ORDER BY tc.table_name`
  )) as any[];
  console.log("\nForeign keys actuales:");
  console.table(fks);

  const pk = (await prisma.$queryRawUnsafe(
    `SELECT kcu.column_name
       FROM information_schema.table_constraints tc
       JOIN information_schema.key_column_usage kcu USING (constraint_schema, constraint_name)
       WHERE tc.table_schema = 'public'
         AND tc.table_name = 'cliente'
         AND tc.constraint_type = 'PRIMARY KEY'`
  )) as any[];
  console.log("\nPK de cliente:", pk);

  const totales = (await prisma.$queryRawUnsafe(
    `SELECT
       (SELECT COUNT(*)::int FROM cliente)   AS clientes,
       (SELECT COUNT(*)::int FROM viajes)    AS viajes,
       (SELECT COUNT(*)::int FROM ubicacion) AS ubicaciones,
       (SELECT COUNT(*)::int FROM pagos)     AS pagos`
  )) as any[];
  console.log("\nConteos finales:", totales[0]);

  const sinClerk = (await prisma.$queryRawUnsafe(
    `SELECT
       (SELECT COUNT(*)::int FROM viajes    WHERE id_clerk IS NULL) AS viajes_sin_clerk,
       (SELECT COUNT(*)::int FROM ubicacion WHERE id_clerk IS NULL) AS ubicacion_sin_clerk`
  )) as any[];
  console.log("Filas sin id_clerk (huérfanas):", sinClerk[0]);
}

main()
  .catch((e) => {
    console.error("Error:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
