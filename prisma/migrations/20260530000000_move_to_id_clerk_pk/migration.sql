-- Migration: id_clerk se convierte en la PK de `cliente` y la FK de `viajes`/`ubicacion`.
-- ANTES DE EJECUTAR EN PRODUCCIÓN:
--   1. Hacer backup completo de la BD.
--   2. Validar invariantes:
--      SELECT COUNT(*) FROM cliente WHERE id_clerk IS NULL;        -- debe ser 0
--      SELECT id_clerk, COUNT(*) FROM cliente
--        GROUP BY id_clerk HAVING COUNT(*) > 1;                    -- debe ser vacío
--      SELECT COUNT(*) FROM viajes
--        WHERE id_cliente IS NOT NULL
--          AND id_cliente NOT IN (SELECT id_cliente FROM cliente); -- viajes huérfanos
--      SELECT COUNT(*) FROM ubicacion
--        WHERE id_cliente IS NOT NULL
--          AND id_cliente NOT IN (SELECT id_cliente FROM cliente); -- ubicaciones huérfanas

BEGIN;

-- 1. Agregar columnas id_clerk en hijas (nullable inicialmente)
ALTER TABLE "viajes"    ADD COLUMN "id_clerk" VARCHAR;
ALTER TABLE "ubicacion" ADD COLUMN "id_clerk" VARCHAR;

-- 2. Backfill desde cliente
UPDATE "viajes" v
  SET "id_clerk" = c."id_clerk"
  FROM "cliente" c
  WHERE v."id_cliente" = c."id_cliente";

UPDATE "ubicacion" u
  SET "id_clerk" = c."id_clerk"
  FROM "cliente" c
  WHERE u."id_cliente" = c."id_cliente";

-- 3. Drop FKs viejas
ALTER TABLE "viajes"    DROP CONSTRAINT IF EXISTS "viajes_id_cliente_fkey";
ALTER TABLE "ubicacion" DROP CONSTRAINT IF EXISTS "ubicacion_id_cliente_fkey";

-- 4. Drop columnas id_cliente en hijas
ALTER TABLE "viajes"    DROP COLUMN "id_cliente";
ALTER TABLE "ubicacion" DROP COLUMN "id_cliente";

-- 5. Cambiar PK de cliente
ALTER TABLE "cliente" ALTER COLUMN "id_clerk" SET NOT NULL;
ALTER TABLE "cliente" DROP CONSTRAINT "cliente_pkey";
-- El @unique sobre id_clerk se vuelve redundante con la PK
ALTER TABLE "cliente" DROP CONSTRAINT IF EXISTS "cliente_id_clerk_key";
ALTER TABLE "cliente" DROP COLUMN "id_cliente";
ALTER TABLE "cliente" ADD PRIMARY KEY ("id_clerk");

-- 6. Recrear FKs apuntando a id_clerk
ALTER TABLE "viajes"
  ADD CONSTRAINT "viajes_id_clerk_fkey" FOREIGN KEY ("id_clerk")
  REFERENCES "cliente"("id_clerk") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "ubicacion"
  ADD CONSTRAINT "ubicacion_id_clerk_fkey" FOREIGN KEY ("id_clerk")
  REFERENCES "cliente"("id_clerk") ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT;
