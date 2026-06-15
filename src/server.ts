import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());
//Tarea libre 1: personalizar el mensaje 
app.get("/", (req, res) => {
  res.json({
    name: "UserManager API",
    version: "1.0.0",
    status: "running",
    author: "Jesica Sama",
    description: "API para la gestión completa de usuarios"
  });
});
//  Tarea libre 2: crear una ruta completamente nueva
app.get("/api/info", (req, res) => {
  res.json({
    project: "UserManager API",
    description: "API REST para gestionar usuarios",
    day: 2,
    technologies: ["Node.js", "Express", "TypeScript"]
  });
});
// Dia 3:Endpoint para comprobar que la API está funcionando, añadir ruta health
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "UserManager API funcionando",
    timestamp: new Date().toISOString(),
    "version": "1.0.0",
    "environment": "development"
  });
});
// --- Dia 3: Parte libre ---
app.get("/api/ping", (req, res) => {
    res.json({
        message: "Pong"
    });
});
// Dia 4, paso 4: Crear una ruta GET para usuarios¶

 app.get("/api/users", (req, res) => {
  res.status(200).json({
    message: "Listado de usuarios",
    data: []
  });
});
// Dia 4 ,Paso 5: Crear una ruta GET por ID¶
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    message: "Detalle de usuario",
    id: id
  });
});
// Paso 6: Crear una ruta POST para usuarios
app.post("/api/users", (req, res) => {
  const userData = req.body;

  res.status(201).json({
    message: "Usuario recibido para crear",
    data: userData
  });
});
// Paso 7: Crear una ruta PATCH para usuarios
app.patch("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  res.status(200).json({
    message: "Usuario recibido para actualizar",
    id: id,
    changes: changes
  });
});
//Paso 8: Crear una ruta DELETE para usuarios
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    message: "Usuario recibido para eliminar o desactivar",
    id: id
  });
});
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});