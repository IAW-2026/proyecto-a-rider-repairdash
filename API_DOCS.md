# Documentación de APIs - RepairDash

Este documento describe los endpoints disponibles en el backend de la aplicación, sus métodos, parámetros esperados y respuestas.

---

## 1. Actualización de Estado del Viaje

**Endpoint:** `/api/repairdash/statetravel`  
**Método HTTP:** `PUT`  
**Descripción:** Permite actualizar el estado de un viaje (o servicio técnico) y ejecutar la lógica de negocio correspondiente, como asignar un conductor, finalizar un servicio, o cancelar un viaje eliminando sus pagos asociados.

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
