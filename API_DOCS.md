# Documentación de APIs - RepairDash

Este documento describe los endpoints disponibles en el backend de la aplicación, sus métodos, parámetros esperados y respuestas.

### Autenticación entre apps

Las apps Driver y Payment deben compartir la misma API key en una variable de entorno, por ejemplo:

- `REPAIRDASH_API_KEY`

La app que consume el endpoint debe enviar esa key en el header:

- `x-api-key: <tu_api_key>`

La API receptora debe validar que el valor recibido coincida con `process.env.REPAIRDASH_API_KEY`. Si no existe o no coincide, la respuesta debe ser `401 Unauthorized`.

---

## 1. App Driver - Actualización de Estado del Viaje

**Endpoint:** `/api/repairdash/statetravel`  
**Método HTTP:** `PUT`  
**Descripción:** Permite actualizar el estado de un viaje (o servicio técnico) y ejecutar la lógica de negocio correspondiente, como asignar un conductor, finalizar un servicio, o cancelar un viaje eliminando sus pagos asociados.

**Header requerido:**

| Campo | Tipo | Requerido | Descripción |
| :---- | :--- | :-------: | :---------- |
| `x-api-key` | `string` | **Sí** | API key compartida entre apps para autorizar la petición. |

### Ejemplo de `fetch`

```ts
const response = await fetch("https://tu-dominio.com/api/repairdash/statetravel", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.REPAIRDASH_API_KEY ?? "",
  },
  body: JSON.stringify({
    id_viaje: 123,
    estado: "aceptado",
    driver: "uuid-del-conductor-456",
  }),
});

const data = await response.json();
```

### Parámetros de la Petición (Body JSON)

| Campo      | Tipo     | Requerido | Descripción                                                                               |
| :--------- | :------- | :-------: | :---------------------------------------------------------------------------------------- |
| `id_viaje` | `number` |  **Sí**   | Identificador único del viaje que se va a modificar.                                      |
| `estado`   | `string` |  **Sí**   | El nuevo estado a asignar. (Es _case-insensitive_, se pasa a minúsculas automáticamente). |
| `driver`   | `string` |   No\*    | Identificador del trabajador/conductor. _(Requerido si el estado es "aceptado")_.         |

**Estados Permitidos para `estado`:**

- `"aceptado"`: Asigna el conductor al viaje y cambia el estado.
- `"cancelado"`: Elimina el viaje y su pago asociado de la base de datos.
- `"en camino"`: Actualiza el estado a en camino.
- `"ha llegado"`: Actualiza el estado notificando la llegada.
- `"finalizado"`: Marca el trabajo como concluido.
### Ejemplos de Body (JSON)

**Ejemplo 1: Asignando conductor (Aceptado)**
```json
{
  "id_viaje": 123,
  "estado": "aceptado",
  "driver": "uuid-del-conductor-456"
}
```

**Ejemplo 2: Actualizando a en camino**
```json
{
  "id_viaje": 123,
  "estado": "en camino"
}
```

**Ejemplo 3: Cancelando el viaje**
```json
{
  "id_viaje": 123,
  "estado": "cancelado"
}
```

**Ejemplo 4: Notificando llegada**
```json
{
  "id_viaje": 123,
  "estado": "ha llegado"
}
```

**Ejemplo 5: Finalizando trabajo**
```json
{
  "id_viaje": 123,
  "estado": "finalizado"
}
```

### Respuestas

- **200 OK**  
  Devuelve un mensaje de éxito dependiendo del estado enviado.
  ```json
  {
    "message": "Viaje aceptado"
  }
  ```
- **400 Bad Request**  
  Ocurre si el estado enviado no coincide con ninguno de los valores predefinidos.
  ```json
  {
    "message": "Estado no válido"
  }
  ```

---

## 2. App Payment - Actualización de Estado del Pago

**Endpoint:** `/api/repairdash/statepayment`  
**Método HTTP:** `PUT`  
**Descripción:** Permite actualizar el estado de un viaje desde la app de pagos, manteniendo la misma estructura general de la API del driver pero sin asignación de conductor.

**Header requerido:**

| Campo | Tipo | Requerido | Descripción |
| :---- | :--- | :-------: | :---------- |
| `x-api-key` | `string` | **Sí** | API key compartida entre apps para autorizar la petición. |

### Ejemplo de `fetch`

```ts
const response = await fetch("https://tu-dominio.com/api/repairdash/statepayment", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.REPAIRDASH_API_KEY ?? "",
  },
  body: JSON.stringify({
    id_viaje: 123,
    estado: "cancelado",
  }),
});

const data = await response.json();
```

### Parámetros de la Petición (Body JSON)

| Campo      | Tipo     | Requerido | Descripción                                                                               |
| :--------- | :------- | :-------: | :---------------------------------------------------------------------------------------- |
| `id_viaje` | `number` |  **Sí**   | Identificador único del viaje que se va a modificar.                                      |
| `estado`   | `string` |  **Sí**   | El nuevo estado a asignar. (Es _case-insensitive_, se pasa a minúsculas automáticamente). |

**Estados Permitidos para `estado`:**

- `"aceptado"`: Actualiza el estado del viaje.
- `"cancelado"`: Actualiza el estado del viaje a cancelado.

### Ejemplos de Body (JSON)

**Ejemplo 1: Aceptando el viaje desde la app payment**
```json
{
  "id_viaje": 123,
  "estado": "aceptado"
}
```

**Ejemplo 2: Cancelando el viaje desde la app payment**
```json
{
  "id_viaje": 123,
  "estado": "cancelado"
}
```

### Respuestas

- **200 OK**  
  Devuelve un mensaje de éxito dependiendo del estado enviado.
  ```json
  {
    "message": "Viaje aceptado"
  }
  ```
- **400 Bad Request**  
  Ocurre si el estado enviado no coincide con ninguno de los valores predefinidos.
  ```json
  {
    "message": "Estado no válido"
  }
  ```

---
