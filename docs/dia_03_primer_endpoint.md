# Día 3: Primer endpoint

## Qué he hecho

- He creado el endpoint `GET /api/health`.
- He devuelto una respuesta JSON.
- He usado el status code `200`.
- He probado la ruta desde navegador.
- He probado la ruta desde Thunder Client o Postman.
- He probado una ruta incorrecta para comprobar qué ocurre.

## Endpoint creado

```http
GET /api/health
```

## Respuesta obtenida

```json
{
  "status": "ok",
  "message": "UserManager API funcionando",
  "timestamp": "..."
}
```
Abre el archivo:

```http
src/server.ts
```
Seguramente tendrás algo parecido a esto:
```javascript
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "UserManager API"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
```
![GET /api/health](./Images/dia3_apiHealth_ok.jpg)
Debajo de la ruta /, añade esta nueva ruta:

![GET /api/health](./Images/dia3_apiHealth_ok2.jpg)
![GET /api/health](./Images/dia3_apiHealth_ok3.jpg)

## Explicación personal
Parte libre
## Tarea libre 2: Crear un endpoint /api/ping
Crea una nueva ruta: GET /api/ping.
Debe devolver una respuesta sencilla
```json
{
  "message": "pong"
}
```
Este tipo de ruta se usa a veces para comprobar que un servidor responde rápidamente.



El endpoint `/api/health` sirve para comprobar que la API está funcionando correctamente. Cuando recibe una petición `GET`, devuelve un JSON con el estado de la aplicación.
## Tarea libre 3: Comparar /, /api/health y /api/ping


| Ruta | Método | Para qué sirve |
| :--- | :---: | :--- |
| / | GET | Mensaje inicial de la API |
| /api/health | GET | Comprobar el estado de la API |
| /api/ping | GET | Comprobar respuesta rápida del servidor |

## Tarea libre 4:  Colección de pruebas

| Petición          | Código esperado | Resultado obtenido |
|-------------------|-----------------|--------------------|
| `GET /`           | 200             | `{ "name": "UserManager API", "version": "1.0.0", "status": "running", "author": "Jesica Sama", "fecha": "11-06-2026" }` |
| `GET /api/health` | 200             | `{ "status": "ok", "message": "UserManager API funcionando", "timestamp": "2026-06-11T10:29:06.891Z" }` |
| `GET /api/ping`   | 200             | `{ "message": "Pong" }` |
