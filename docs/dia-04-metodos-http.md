# Día 4: Métodos HTTP

## Qué he hecho

- He creado rutas simuladas para usuarios.
- He probado `GET /api/users`.
- He probado `GET /api/users/:id`.
- He probado `POST /api/users` enviando JSON.
- He probado `PATCH /api/users/:id` enviando JSON.
- He probado `DELETE /api/users/:id`.
- He creado una colección de pruebas en Thunder Client o Postman.

## Endpoints trabajados

```http
GET /api/users
GET /api/users/:id
POST /api/users
PATCH /api/users/:id
DELETE /api/users/:id
```

## Explicación personal

GET sirve para obtener información.
POST sirve para crear información.
PATCH sirve para modificar parte de un recurso.
DELETE sirve para eliminar o desactivar un recurso.

# Parte guiada

## Paso 1: Abrir el proyecto

Abre el repositorio del reto:


Entra en la carpeta del proyecto:

```bash
cd usermanager-api
```

Comprueba que tienes la estructura del día anterior:

```bash
usermanager-api/
  README.md
  package.json
  package-lock.json
  tsconfig.json
  src/
    server.ts
  docs/
    dia-01-diseno-inicial.md
    dia-02-preparacion-proyecto.md
    dia-03-primer-endpoint.md
```

## Paso 2: Arrancar el servidor

Ejecuta:

```bash
npm run dev
```

![GET /api/health](./Images/dia4_arrancarServidor.jpg)
Comprueba que el servidor funciona visitando:

```bash
http://localhost:3000/api/health
```

Se recibe la respuesta correcta, continuamos.

## Paso 3: Abrir: src/server.ts

Abre:

```bash
src/server.ts
```
Al abrir nos saldra algo parecido a esto: 

```bash
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "UserManager API"
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "UserManager API funcionando",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
```

## Paso 4: Crear una ruta GET para usuarios

Añadimos la siguiente ruta debajo de /api/healt:

```bash
app.get("/api/users", (req, res) => {
  res.status(200).json({
    message: "Listado de usuarios",
    data: []
  });
});
```

![GET /api/health](./Images/dia4_CrearRutaGetUsuarios.jpg)

Esta ruta todavia no devuelve usuarios reales. Devuelve un array vacio para simular que todavia no tenemos datos.

```bash
GET http://localhost:3000/api/users
```

Prueba: 

![GET /api/health](./Images/dia4_paso4_pruebaGet.jpg)

La respuesta es la esperada, tiene que salir:

```bash
{
  "message": "Listado de usuarios",
  "data": []
}
```

## Paso 5: Crear una ruta GET por ID

Añadimos la siguiente ruta:

```bash
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    message: "Detalle de usuario",
    id: id
  });
});
```

Prueba:
![GET /api/health](./Images/dia4_paso5_pruebaGet_ID.jpg)

La respuesta es la esperada, tiene que salir:

```bash
{
  "message": "Detalle de usuario",
  "id": "1"
}
```

En el resultado no sale el valor "1" como texto. Esto ocurre porque los parámetros de ruta llegan como string.

## Paso 6:Crear una ruta POST para usuarios

Añadimos esta ruta:

```bash
app.post("/api/users", (req, res) => {
  const userData = req.body;

  res.status(201).json({
    message: "Usuario recibido para crear",
    data: userData
  });
});
```

Prueba:

```bash
POST http://localhost:3000/api/users
```

![GET /api/health](./Images/dia4_prueba6_AñadirRutaPost.jpg)

En el body envía JSON:

```ts
{
  "name": "Carlos Pérez",
  "email": "carlos@email.com",
  "password": "123456"
}
```

![GET /api/health](./Images/dia4_paso6_BodyJSON_Guardar.jpg)
La respuesta esperada:

```ts
{
  "message": "Usuario recibido para crear",
  "data": {
    "name": "Carlos Pérez",
    "email": "carlos@email.com",
    "password": "123456"
  }
}
```

![GET /api/health](./Images/dia4_paso6_BodyJSON_Final.jpg)
De momento estamos devolviendo tambien la contraseña porque estamos simulando. Mas adelante no se devolvera ninguna contraseña.



