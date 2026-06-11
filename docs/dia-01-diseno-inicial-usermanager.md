# UserManager API - Diseño inicial

[cite_start]UserManager API es una API REST para gestionar usuarios de una aplicación[cite: 7, 8, 298]. [cite_start]Permitirá registrar usuarios, iniciar sesión, consultar perfiles, modificar datos, gestionar roles y proteger rutas privadas mediante autenticación[cite: 299].

---

## 1. Recursos Principales
[cite_start]La API organizará la información en tres grupos principales de rutas[cite: 28, 49, 79]:

| Recurso | Explicación |
| :--- | :--- |
| `/auth` | [cite_start]Servirá para registrar usuarios e iniciar sesión[cite: 302]. |
| `/users` | [cite_start]Servirá para consultar, crear, modificar y eliminar usuarios[cite: 302]. |
| `/health` | [cite_start]Servirá para comprobar que la API está funcionando[cite: 302]. |

---

## 2. Modelo de Usuario
[cite_start]Cada usuario dentro del sistema contará con la siguiente estructura de datos[cite: 114, 115, 116]:

* [cite_start]**id**: Identificador único del usuario[cite: 130].
* [cite_start]**name**: Nombre completo del usuario[cite: 132, 314].
* [cite_start]**email**: Correo electrónico del usuario[cite: 134, 314].
* [cite_start]**passwordHash**: Contraseña cifrada del usuario por seguridad[cite: 135, 137, 314].
* [cite_start]**role**: Rol del usuario, que puede ser `USER` o `ADMIN`[cite: 138, 314].
* [cite_start]**isActive**: Indica si el usuario está activo o desactivado (borrado lógico)[cite: 75, 76, 140, 314].
* [cite_start]**createdAt**: Fecha de creación del registro[cite: 145, 314].
* [cite_start]**updatedAt**: Fecha de la última modificación[cite: 147, 319].

---

## 3. Tabla de Endpoints (Rutas de la API)
[cite_start]Combinación de métodos HTTP y rutas para interactuar con el sistema[cite: 56, 57]:

| Método | Ruta | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | [cite_start]Comprueba si la API funciona [cite: 322] | [cite_start]Público [cite: 322] |
| **POST** | `/api/auth/register` | [cite_start]Registra un nuevo usuario [cite: 322] | [cite_start]Público [cite: 322] |
| **POST** | `/api/auth/login` | [cite_start]Inicia sesión en el sistema [cite: 322] | [cite_start]Público [cite: 322] |
| **GET** | `/api/users/me` | [cite_start]Consulta el perfil del usuario actual [cite: 322] | [cite_start]Usuario autenticado [cite: 322] |
| **GET** | `/api/users` | [cite_start]Lista todos los usuarios [cite: 322] | [cite_start]Solo `ADMIN` [cite: 322] |
| **GET** | `/api/users/:id` | [cite_start]Consulta un usuario por su ID [cite: 322] | [cite_start]`ADMIN` o propio usuario [cite: 322] |
| **PATCH** | `/api/users/:id` | [cite_start]Modifica los datos de un usuario [cite: 322] | [cite_start]`ADMIN` o propio usuario [cite: 322] |
| **DELETE**| `/api/users/:id` | [cite_start]Elimina o desactiva un usuario [cite: 322] | [cite_start]Solo `ADMIN` [cite: 322] |
| **PATCH** | `/api/users/me/password`| [cite_start]Cambia la contraseña del usuario [cite: 322] | [cite_start]Usuario autenticado [cite: 322] |
| **PATCH** | `/api/users/:id/role` | [cite_start]Cambia el rol de un usuario [cite: 322] | [cite_start]Solo `ADMIN` [cite: 322] |
| **PATCH** | `/api/users/:id/status` | [cite_start]Activa o desactiva a un usuario [cite: 328, 329, 330] | [cite_start]Solo `ADMIN` [cite: 331] |

---

## 4. Esquema de Funcionamiento General
[cite_start]El cliente (Frontend o Postman) envía una petición a la API[cite: 335, 336, 340]. [cite_start]La API valida los datos, aplica la lógica de negocio, consulta o modifica la base de datos y finalmente devuelve una respuesta al cliente[cite: 334, 337, 338, 340].

---

## 5. Reglas Iniciales del Sistema
1. [cite_start]El email no se puede repetir en la base de datos[cite: 343].
2. [cite_start]La contraseña nunca se guarda en texto plano[cite: 344].
3. [cite_start]La API jamás devolverá el campo `passwordHash` en las respuestas[cite: 345].
4. [cite_start]Un usuario con rol `USER` solo puede acceder y modificar su propia información[cite: 346].
5. [cite_start]Un usuario con rol `ADMIN` tiene permisos para gestionar a todos los usuarios[cite: 347].
6. [cite_start]Un usuario marcado como inactivo (`isActive: false`) no podrá iniciar sesión[cite: 77, 348].

### [cite_start]Reglas propuestas (Tarea Libre 1) [cite: 351]
7. [cite_start]El formato del correo electrónico introducido debe ser válido (debe contener un `@` y un dominio)[cite: 357].
8. [cite_start]La contraseña debe tener una longitud mínima de 8 caracteres para garantizar una seguridad básica[cite: 354].

---

## [cite_start]6. Gestión de Errores Posibles (Tarea Libre 2) [cite: 359]
* [cite_start]**Error 1: Registro con email duplicado** [cite: 363]
  * [cite_start]*Situación:* Un usuario intenta registrarse usando un correo que ya está en el sistema[cite: 363].
  * [cite_start]*Código HTTP:* `409 Conflict`[cite: 364].
* **Error 2: Intento de acceso no autorizado**
  * [cite_start]*Situación:* Un usuario con rol `USER` intenta acceder a la ruta `GET /api/users` para listar a todos los usuarios (ruta exclusiva de administradores)[cite: 162, 322].
  * [cite_start]*Código HTTP:* `403 Forbidden`[cite: 185, 261].

---

## [cite_start]7. Ejemplo de Respuesta JSON (Tarea Libre 3) [cite: 366]
[cite_start]Cuando un usuario consulte su propio perfil a través de la ruta `GET /api/users/me` [cite: 368, 369][cite_start], la API responderá con este formato de datos (sin incluir jamás información de la contraseña)[cite: 370, 381]:

```json
{
  "id": 1,
  "name": "Ana García",
  "email": "ana@email.com",
  "role": "USER",
  "isActive": true
}