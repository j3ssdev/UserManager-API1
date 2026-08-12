# Día 31 - Limpieza y refactor

## Qué he hecho

- He revisado el proyecto después de crear el CRUD persistente.
- He eliminado o apartado rutas temporales de debug.
- He limpiado server.ts.
- He revisado user.routes.ts.
- He limpiado user.controller.ts.
- He revisado user.service.ts.
- He revisado user.repository.ts.
- He creado utilidades reutilizables.
- He creado parse.utils.ts.
- He creado string.utils.ts.
- He eliminado imports innecesarios.
- He comprobado que las rutas principales siguen funcionando.
- He ejecutado npm run build.
- He actualizado el README.

## Estructura después del refactor

```text
src/
  prisma.ts
  server.ts
  controllers/
    health.controller.ts
    user.controller.ts
  errors/
    AppError.ts
  repositories/
    user.repository.ts
  routes/
    health.routes.ts
    user.routes.ts
  services/
    user.service.ts
  utils/
    parse.utils.ts
    string.utils.ts
```

## Rutas principales

| Método | Ruta | Acción | Imagen |
| --- | --- | --- | --- |
| GET | `/api/health` | Estado de la API | ![Imagen](./Images/dia31_probar_healt.png) |
| GET | `/api/users` | Listar usuarios | ![Imagen](./Images/dia31_listado_usuarios.png) |
| GET | `/api/users/:id` | Consultar usuario | ![Imagen](./Images/dia31_usuario_id.png) |
| POST | `/api/users` | Crear usuario | ![Imagen](./Images/dia31_usario15_creado.png) |
| PATCH | `/api/users/:id` | Actualizar usuario | ![Imagen](./Images/dia31_probar_actualizacion.png) |
| DELETE | `/api/users/:id` | Desactivar usuario | ![Imagen](./Images/dia31_probar_desactivacion.png) |

![Imagen](./Images/dia31_prisma.png)

## Cambios de refactor

| Antes | Después |
| --- | --- |
| Rutas temporales de debug | Rutas reales `/api/users` |
| Parseo de ID repetido | `parseIdParam` |
| Funciones de string dentro del servicio | `string.utils.ts` |
| Imports no usados | Imports limpiados |
| README desactualizado | README actualizado |

## Flujo actual

```text
Route → Controller → Service → Repository → Prisma → PostgreSQL
```

## Explicación personal

Refactorizar permite mejorar la estructura del código sin cambiar el comportamiento externo de la API. Después de este día, el proyecto queda más limpio y preparado para empezar la fase de seguridad.

```mermaid
flowchart LR
    A["Cliente HTTP"] --> B["Route"]
    B --> C["Controller"]
    C --> D["Service"]
    D --> E["Repository"]
    E --> F["Prisma"]
    F --> G["PostgreSQL"]
```
