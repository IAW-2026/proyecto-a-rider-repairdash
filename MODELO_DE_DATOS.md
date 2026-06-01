# Modelo de Datos (Base de Datos)

La base de datos (PostgreSQL en Supabase) está estructurada a través de **Prisma ORM**. Todo el esquema relacional gira en torno al usuario (cliente) y sus interacciones en la plataforma. Así quedaron conformadas las tablas principales:

## `cliente` (Usuarios)

Es el núcleo del sistema. Contiene los datos personales de los usuarios y sirve como punto de anclaje para el resto de las tablas.

- **Campos principales:** `id_clerk` (PK, string del tipo `user_xxx`), `nombre`, `apellido`, `mail` (Único), `calificacion`.
- **Integración con Clerk:** La clave primaria es directamente el identificador que viene desde nuestro proveedor de autenticación. Gracias al patrón de "Lazy Provisioning", cuando un usuario inicia sesión por primera vez, su cuenta de Clerk queda atada a un registro en esta tabla usando el mismo id. Ver sección 3.5 para el racional de esta decisión.
- **Relaciones:** Un cliente puede tener muchas ubicaciones, muchos viajes y múltiples promociones.

## `ubicacion` (Direcciones)

Almacena las distintas direcciones que un cliente registra en la plataforma.

- **Campos principales:** `id_ubicacion` (PK), `id_clerk` (FK a `cliente`), `calle`, `numero`, `ciudad`.
- **Detalle:** Antes de guardar cualquier registro aquí, las direcciones son validadas con la API de Nominatim (OpenStreetMap).
- **Relaciones:** Pertenece a un `cliente` y se vincula con los `viajes` (un viaje ocurre en una ubicación específica).

## `viajes` (Servicios Técnicos)

Representa el corazón operativo de la aplicación. Registra cada solicitud de servicio técnico.

- **Campos principales:** `id_viaje` (PK), `tipo_de_trabajo`, `driver` (El nombre del técnico asignado), `fecha`, y un `estado` (Por defecto arranca en `"Pendiente"`).
- **Relaciones:** Cada viaje está atado a un `cliente` (FK `id_clerk`) y a una `ubicacion` (FK). Además, puede tener varios registros de `pagos` asociados.

## `pagos` (Transacciones)

Guarda el registro monetario asociado a los viajes.

- **Campos principales:** `id_pago` (PK), `monto` (Decimal), `estado` (ej. pendiente, completado).
- **Relaciones:** Pertenece a un viaje (`id_viaje`). Si un viaje se elimina, sus pagos asociados también se eliminan automáticamente gracias a la restricción de base de datos _Cascade_.

## `promociones` (Descuentos)

Esta tabla que figura inicalmente en el modelo de datos fue removida pues se opto por consultar las promociones previo a presentar el formulario de solicitud de nuevo viaje ya que se ahora el paso de tener que verificar los codigos que los usarios ingresan

---
