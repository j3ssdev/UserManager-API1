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

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});