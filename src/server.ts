import express from "express";

const app = express();
const PORT = 3000;

type User = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
app.use(express.json());

// Debajo del tipo User, creamos un array llamado users

const users: User[] = [
  {
    id: 1,
    name: "Ana García",
    email: "ana@email.com",
    role: "USER",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Carlos Pérez",
    email: "carlos@email.com",
    role: "ADMIN",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Laura Martínez",
    email: "laura@email.com",
    role: "USER",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
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
// Dia 4, paso 4: Crear una ruta GET para usuarios

 app.get("/api/users", (req, res) => {
  res.status(200).json({
    message: "Listado de usuarios",
    total: users.length,
    data: users
  });
});
// Tarea libre 1: Añadir una ruta para consultar tu propio perfil
app.get("/api/users/me", (req, res) => {
    res.status(200).json({
        "id": 1,
        "name": "Jesica Sama",
        "email": "jesica@email.com",
        "role": "USER",
        "isActive": true
    });
});
// Dia 5 - Tarea libre 1: Crear una ruta de búsqueda simulada
app.get("/api/users/search", (req, res) => {
  res.status(200).json({
    message: "Búsqueda de usuarios",
    filters: {
      name: "ana",
      role: "USER"
    }
  });
});
// Dia 4: Paso 5: Crear una ruta GET por ID (ruta dinamica)
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: "El ID debe ser un número"
    });
  }

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  return res.status(200).json({
    message: "Usuario encontrado",
    data: user
  });
});
// Dia 4:Paso 6: Crear una ruta POST para usuarios
app.post("/api/users", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "name, email y password son obligatorios"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: "La contraseña debe tener al menos 6 caracteres"
    });
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(409).json({
      error: "El email ya está registrado"
    });
  }

  const newId = users.length > 0
    ? Math.max(...users.map((user) => user.id)) + 1
    : 1;

  const newUser: User = {
    id: newId,
    name,
    email,
    role: "USER",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);

  return res.status(201).json({
    message: "Usuario creado correctamente",
    data: newUser
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
// Tarea Libre 2
app.patch("/api/users/:id/status", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  res.status(200).json({
    message: "Estado de usuario recibido para actualizar",
    id: id,
    isActive: false
  });
});
// Tarea Libre 3
app.patch("/api/users/:id/role", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  res.status(200).json({
    message: "Rol de usuario recibido para actualizar",
    id: "1",
    isActive: "ADMIN"
  });
});
//Dia 5: Paso 3: Crear una ruta para probar body
app.post("/api/debug/body", (req, res) => {
  res.status(200).json({
    message: "Body recibido correctamente",
    body: req.body
  });
});
// Dia 5: Paso 4: Crear una ruta para probar query
app.get("/api/debug/params/:id", (req, res) => {
  res.status(200).json({
    message: "Params recibidos correctamente",
    params: req.params
  });
});
// Dia 5: Paso 5Crear una ruta para probar query params
app.get("/api/debug/query", (req, res) => {
  res.status(200).json({
    message: "Query params recibidos correctamente",
    query: req.query
  });
});
//Dia 5:Paso 6: Crear una ruta para probar headers
app.get("/api/debug/headers", (req, res) => {
  res.status(200).json({
    message: "Headers recibidos correctamente",
    headers: req.headers
  });
});
app.patch("/api/debug/users/:id", (req, res) => {
  const { id } = req.params;
  const { notify } = req.query;
  const authorization = req.headers.authorization;
  const changes = req.body;

  res.status(200).json({
    message: "Datos combinados recibidos",
    id,
    notify,
    authorization,
    changes
  });
});
// Dia 5 - Tarea libre 2: Crear una ruta de cambio de contraseña simulada
app.patch("/api/users/me/password", (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Simulación: no devolvemos contraseñas por seguridad
  res.status(200).json({
    message: "Solicitud de cambio de contraseña recibida"
  });
});
// Dia 5 - Tarea libre 3: Leer un header personalizado
app.get("/api/debug/client", (req, res) => {
  const clientName = req.headers["x-client-name"];

  res.status(200).json({
    client: clientName
  });
});
// Dia 6 -Crear una ruta temporal para depuracion
app.post("/api/debug/request", (req, res) => {
  res.status(200).json({
    message: "Información completa de la petición",
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    headers: req.headers,
    body: req.body
  });
});
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
