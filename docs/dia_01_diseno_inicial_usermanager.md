# UserManager API - Diseño inicial

## Descripción
UserManager API es una API REST para gestionar usuarios de una aplicación. Permitirá:
- Registrar usuarios.
- Iniciar sesión.
- Consultar perfiles.
- Modificar datos.
- Gestionar roles.
- Proteger rutas privadas con autenticación.

## Recursos principales
- `/auth`: Servirá para registrar usuarios e iniciar sesión.
- `/users`: Servirá para consultar, crear, modificar y eliminar usuarios.
- `/health`: Servirá para comprobar que la API está funcionando.

## Modelo de usuario
User
- `id`: PK (Clave Primaria).
- `name`: Nombre completo.
- `email`: Correo electrónico.
- `passwordHash`: Contraseña cifrada.
- `role`: Rol (`USER` / `ADMIN`).
- `isActive`: Estado en el servidor (`true` = Activo / `false` = Inactivo).
- `createdAt`: Fecha de creación.
- `updatedAt`: Fecha de la última modificación.

## Endpoints

| Método | Ruta | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Comprueba si la API funciona | Público |
| `POST` | `/api/auth/register` | Registra un usuario | Público |
| `POST` | `/api/auth/login` | Inicia sesión | Público |
| `GET` | `/api/users/me` | Consulta mi perfil | Usuario autenticado |
| `GET` | `/api/users` | Lista todos los usuarios | `ADMIN` |
| `GET` | `/api/users/:id` | Consulta un usuario por ID | `ADMIN` o propio usuario |
| `PATCH` | `/api/users/:id` | Modifica un usuario | `ADMIN` o propio usuario |
| `DELETE` | `/api/users/:id` | Elimina o desactiva un usuario | `ADMIN` |
| `PATCH` | `/api/users/me/password` | Cambia mi contraseña | Usuario autenticado |
| `PATCH` | `/api/users/:id/role` | Cambia el rol de un usuario | `ADMIN` |
| `PATCH` | `/api/users/:id/status` | Activa o desactiva un usuario | `ADMIN` |

## Flujo general
![Esquema de flujo](./Images/esquema_flujo_Api.png)

El cliente envía una petición a la API. La API valida los datos, aplica la lógica necesaria, consulta o modifica la base de datos y devuelve una respuesta.

## Reglas iniciales
- El email no se puede repetir.
- La contraseña no se guarda en texto plano.
- La API nunca devuelve `passwordHash`.
- Un `USER` solo puede acceder a su propia información.
- Un `ADMIN` puede gestionar usuarios.
- Un usuario inactivo no puede iniciar sesión.

## Reglas propuestas (Tarea Libre 1)
- La contraseña debe tener al menos 8 caracteres.
- El nombre del usuario no puede estar vacío.

## Posibles errores (Tarea Libre 2)
- Intentar registrar un email ya existente → `409 Conflict`
- Intentar consultar un usuario que no existe → `404 Not Found`

## Respuesta JSON (Tarea Libre 3)
* **Ruta:** `GET /api/users/me`

```json
{
  "id": 1,
  "name": "Jesica Sama",
  "email": "jesica@mail.com",
  "role": "ADMIN",
  "isActive": true
}