# Documentación de RepairDash

## 1. Introducción

RepairDash es una plataforma desarrollada para la gestión de servicios técnicos ("Riders"). El objetivo de este proyecto es construir un sistema escalable, seguro y rápido, que ofrezca una buena experiencia de usuario (UX). En este documento se detallan las tecnologías utilizadas y las principales decisiones de arquitectura tomadas durante el desarrollo.

---

## 2. Stack Tecnológico

- **Framework Core:** Next.js (App Router) con React 19 para estructurar una arquitectura moderna basada en componentes de servidor y cliente.
- **Lenguaje:** TypeScript, para tener un tipado estático fuerte y evitar errores en tiempo de ejecución.
- **Estilos:** Tailwind CSS v4, usando utilidades modernas para armar un diseño responsivo y limpio.
- **Base de Datos:** PostgreSQL, alojado en Supabase.
- **ORM:** Prisma (`@prisma/client` y `@prisma/adapter-pg`) para interactuar con la base de datos de forma segura y fuertemente tipada.
- **Autenticación:** Clerk (`@clerk/nextjs`) para manejar el registro, login y sesiones de los usuarios.
- **Tiempo Real:** Supabase Realtime, para manejar actualizaciones instantáneas vía WebSockets.
- **Notificaciones:** Sonner, para mostrar alertas (toasts) en la interfaz.
- **Gestor de Paquetes:** pnpm, elegido por ser más rápido y eficiente con el espacio en disco en comparación a npm.

---

## 3. Decisiones de Arquitectura

### 3.1. Separación Cliente-Servidor

Se mantuvo una separación estricta entre el frontend y el backend dentro del entorno de Next.js:

- **Client Components (`"use client"`):** Se usan exclusivamente para manejar el estado local, la interactividad del usuario (clicks, formularios), las animaciones y las conexiones por WebSockets.
- **Server Actions (`lib/actions/*`):** Se encargan de todas las consultas y modificaciones a la base de datos a través de Prisma. Esto asegura que la lógica sensible de negocio ocurra de forma segura en el servidor, sin exponerse al cliente.

### 3.2. Sincronización de Usuarios ("Lazy Provisioning")

Aunque usamos Clerk para la autenticación, necesitamos guardar a los usuarios en nuestra propia base de datos (tabla `cliente`) para poder vincularlos con sus respectivos viajes y pagos.
Para no forzar al usuario a llenar un formulario extra después de registrarse, implementamos un patrón de **"Lazy Provisioning"** (`app/_components/ProvisioningPerezoso.tsx`). Este componente sincroniza automáticamente los datos de Clerk con Prisma en segundo plano durante la primera visita del usuario, mostrando estados de carga para evitar saltos extraños en la interfaz visual.

### 3.3. Tiempo Real y Actualizaciones (Live Updates)

Para mantener la información actualizada en pantalla, usamos dos estrategias diferentes:

- **Estado de los Viajes (Cliente):** Para visualizar si un viaje está "Pendiente", "En camino" o "Finalizado", integramos **Supabase Realtime** (`viajeEnCurso.tsx`). El cliente se suscribe a un canal y recibe los cambios de estado de la base de datos de forma instantánea.
- **Dashboard del Administrador:** Como las cachés estáticas de Next.js a veces provocaban que se mostraran datos viejos, implementamos un sistema de "Live Updates" (polling). El cliente hace peticiones periódicas que ejecutan un Server Action con `revalidatePath`. Esto limpia la caché de Next.js y asegura que las listas se actualicen solas sin que el administrador tenga que recargar la página manualmente.

### 3.4. Validación de Direcciones con Nominatim

Para evitar que los usuarios ingresen direcciones falsas o mal escritas, decidimos no depender de campos de texto libre. Integramos la API de **Nominatim (OpenStreetMap)** para validar que la dirección existe realmente en Argentina antes de guardarla.
Además, para manejar errores (como ubicaciones duplicadas o no encontradas), usamos el hook `useActionState` de React junto con las notificaciones de Sonner, lo que nos permite avisarle al usuario del problema sin tener que recargar o redirigir la página.

### 3.5. Identidad del cliente: `id_clerk` como clave única

Originalmente la tabla `cliente` usaba un `id_cliente` autoincremental como clave primaria, y la columna `id_clerk` quedaba como simple referencia única al usuario en Clerk. Detectamos un problema serio con este diseño: el `id_cliente` es **volátil**. Si una fila se borraba y se recreaba (por una limpieza administrativa, por un webhook de Clerk, o porque el cliente se daba de baja y volvía a registrarse), el cliente quedaba con un id_cliente nuevo, pero su navegador conservaba la URL vieja (`/user/7/menu`) en historial, bookmarks o autocompletado. Al volver a entrar, los server actions confiaban en ese id viejo y Prisma rebotaba con un error de foreign key.

Decidimos eliminar `id_cliente` por completo y promover `id_clerk` (string del tipo `user_xxx`) a clave primaria del modelo. Las foreign keys de `viajes` y `ubicacion` ahora apuntan a `cliente.id_clerk`. El identificador de Clerk es **estable**: nunca cambia mientras la cuenta de Clerk exista, así que las URLs persistidas en el browser siguen siendo válidas a través del tiempo.

### 3.6. Compresión de imágenes en el cliente

Los server actions de Next.js tienen un límite de body de 1 MB por defecto, y Vercel rechaza requests por encima de 4.5 MB en sus funciones serverless. Las fotos modernas chocan con esos techos sin esfuerzo: una imagen sacada con un teléfono de 12 megapíxeles ronda los 3-8 MB, y las imágenes generadas por IA en alta definición llegan a 4-10 MB. Subir más de una foto en el formulario de nuevo trabajo hacía explotar el request antes de llegar al server.

Decidimos resolverlo del lado del cliente, redimensionando y recomprimiendo las imágenes en el navegador antes del submit (`lib/utils/compressImage.ts`). El helper carga el archivo en un elemento `<img>`, lo redibuja en un `<canvas>` con un máximo de 1920px en el lado mayor y lo exporta con `canvas.toBlob` como JPEG de calidad 0.85. Estos parámetros son un balance pensado: 1920px es suficiente para previews en mobile y desktop sin desperdiciar bytes. Si la imagen ya pesa menos de 800 KB y no excede el tamaño máximo, el helper la deja pasar sin tocar para no introducir una generación adicional de pérdida.

Elegimos resolverlo con APIs nativas del navegador en vez de incorporar una librería como `browser-image-compression` o `pica`: el problema se resuelve en pocas líneas y no justifica sumar 50-200 KB al bundle del cliente. También descartamos subir el límite de body de los server actions, porque es un parche que no escala (Vercel sigue rechazando arriba de 4.5 MB y mover archivos pesados sobre redes móviles débiles es lento aunque el server los acepte). El otro camino válido habría sido implementar upload directo del navegador a Vercel Blob, pero hoy las fotos ni siquiera se persisten en el backend, así que sería código sin uso real; queda como evolución natural cuando se descomente el flujo de envío al microservicio de drivers.

Para integrar la compresión sin perder la estructura del form action de Next, envolvimos `action={distribuirFormulario}` con un callback async en cliente que comprime las fotos del FormData antes de delegar al server action. Esto mantiene el `useFormStatus()` para el pending state automático del botón y el comportamiento progressive enhancement del `<form>` real.

---

## 4. Diseño y Rendimiento

### 4.1. Interfaz de Usuario (UI)

Para el panel de administración, buscamos un diseño más limpio y profesional. Dejamos de usar contenedores redondeados tipo "burbuja" y pasamos a usar layouts rectangulares que ocupan todo el ancho de la pantalla, aprovechando mejor el espacio visual.
En cuanto a la tipografía, evitamos abusar del `font-bold` en títulos grandes para que las letras no se vean distorsionadas, utilizando en su lugar `font-semibold` o `font-medium`.

### 4.2. Skeletons Dinámicos

En lugar de usar un archivo `loading.tsx` global que bloquea toda la pantalla mientras cargan los datos, creamos componentes **Skeleton** (como `MenuSkeleton`). Usando las fronteras `<Suspense>` de React, mostramos animaciones de carga (shimmer y pulse) solo en las partes de la página que están esperando datos. Esto permite que la aplicación se sienta mucho más fluida.

### 4.3. Optimización de Carga (LCP)

Para mejorar el rendimiento general y cumplir con las métricas de Core Web Vitals (especialmente el _Largest Contentful Paint_ o LCP), implementamos "Parallel Data Fetching" (hacer varias consultas a la base de datos al mismo tiempo) y "Dynamic Code Splitting". Esto asegura que los componentes más pesados solo se carguen cuando el usuario realmente los necesita. Un ejemplo es lo implementado en el profile de los usuarios al solicitar clientes, viajes y usuario actual de clerk

---

## 5. Modelo de Datos (Base de Datos)

La base de datos (PostgreSQL en Supabase) está estructurada a través de **Prisma ORM**. Todo el esquema relacional gira en torno al usuario (cliente) y sus interacciones en la plataforma. Así quedaron conformadas las tablas principales:

### `cliente` (Usuarios)

Es el núcleo del sistema. Contiene los datos personales de los usuarios y sirve como punto de anclaje para el resto de las tablas.

- **Campos principales:** `id_clerk` (PK, string del tipo `user_xxx`), `nombre`, `apellido`, `mail` (Único), `calificacion`.
- **Integración con Clerk:** La clave primaria es directamente el identificador que viene desde nuestro proveedor de autenticación. Gracias al patrón de "Lazy Provisioning", cuando un usuario inicia sesión por primera vez, su cuenta de Clerk queda atada a un registro en esta tabla usando el mismo id. Ver sección 3.5 para el racional de esta decisión.
- **Relaciones:** Un cliente puede tener muchas ubicaciones, muchos viajes y múltiples promociones.

### `ubicacion` (Direcciones)

Almacena las distintas direcciones que un cliente registra en la plataforma.

- **Campos principales:** `id_ubicacion` (PK), `id_clerk` (FK a `cliente`), `calle`, `numero`, `ciudad`.
- **Detalle:** Antes de guardar cualquier registro aquí, las direcciones son validadas con la API de Nominatim (OpenStreetMap).
- **Relaciones:** Pertenece a un `cliente` y se vincula con los `viajes` (un viaje ocurre en una ubicación específica).

### `viajes` (Servicios Técnicos)

Representa el corazón operativo de la aplicación. Registra cada solicitud de servicio técnico.

- **Campos principales:** `id_viaje` (PK), `tipo_de_trabajo`, `driver` (El nombre del técnico asignado), `fecha`, y un `estado` (Por defecto arranca en `"Pendiente"`).
- **Relaciones:** Cada viaje está atado a un `cliente` (FK `id_clerk`) y a una `ubicacion` (FK). Además, puede tener varios registros de `pagos` asociados.

### `pagos` (Transacciones)

Guarda el registro monetario asociado a los viajes.

- **Campos principales:** `id_pago` (PK), `monto` (Decimal), `estado` (ej. pendiente, completado).
- **Relaciones:** Pertenece a un viaje (`id_viaje`). Si un viaje se elimina, sus pagos asociados también se eliminan automáticamente gracias a la restricción de base de datos _Cascade_.

### `promociones` (Descuentos)

Esta tabla que figura inicalmente en el modelo de datos fue removida pues se opto por consultar las promociones previo a presentar el formulario de solicitud de nuevo viaje ya que se ahora el paso de tener que verificar los codigos que los usarios ingresan

---

## 6. Documentación de APIs (Mock / Webhooks)

El sistema expone distintos endpoints bajo la ruta `/api` destinados tanto a integraciones con servicios de terceros (Clerk) como a simulaciones de la aplicación de conductores (Rider App).

Para las rutas protegidas (`/api/repairdash/*`), se debe enviar un encabezado de seguridad `x-api-key` cuyo valor debe coincidir con la variable de entorno `REPAIRDASH_API_KEY`.

### 6.1. Actualizar Estado del Viaje

- **Ruta:** `PUT /api/repairdash/statetravel`
- **Seguridad:** Requiere header `x-api-key`.
- **Descripción:** Permite a la aplicación externa (app del técnico) notificar cambios en el progreso del viaje.
- **Body JSON:**
  ```json
  {
    "id_viaje": 123,
    "estado": "en camino",
    "driver": "Juan Pérez" // (Opcional) Solo requerido al aceptar.
  }
  ```
- **Estados Válidos:** `"aceptado"`, `"en camino"`, `"ha llegado"`, `"finalizado"`, `"cancelado"`.
- **Validaciones:** Si el viaje ya se encuentra en un estado terminal (`cancelado`, `concluido`, `finalizado`), el endpoint devolverá un código HTTP `400 Bad Request`.

### 6.2. Actualizar Estado del Pago

- **Ruta:** `PUT /api/repairdash/statepayment`
- **Seguridad:** Requiere header `x-api-key`.
- **Descripción:** Simula la respuesta de una pasarela de pagos al intentar procesar un cobro (aprobado o rechazado).
- **Body JSON:**
  ```json
  {
    "id_viaje": 123,
    "estado": "aceptado"
  }
  ```
- **Estados Válidos:**
  - `"aceptado"`: Actualiza tanto la tabla pagos como el estado del viaje a `"aceptado"`.
  - `"rechazado"`: Cancela el viaje de forma automática (estado `"cancelado"`).

### 6.3. Webhooks de Autenticación

- **Ruta:** `POST /api/webhooks/clerk`
- **Seguridad:** Requiere headers de firma de `Svix` (`svix-id`, `svix-timestamp`, `svix-signature`) y secreto válido.
- **Descripción:** Es un webhook pasivo configurado en el Dashboard de Clerk. Escucha eventos de modificaciones en las cuentas de los usuarios.
- **Eventos soportados actualmente:**
  - `user.updated`: Sincroniza y sobrescribe en Prisma los datos de perfil del cliente (email, nombre, apellido) si el usuario decide cambiarlos directamente desde la interfaz de gestión de Clerk, manteniendo ambas bases de datos integradas.
