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


// Datos temporales en memoria. Más adelante se sustituirán por una base de datos.
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

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function isValidBasicEmail(value: string): boolean {
    return value.includes("@") && value.includes(".");
}

function isEmailTaken(email: string, userIdToIgnore?: number): boolean {
    const normalizedEmail = normalizeEmail(email);

    return users.some(
        (user) => user.email === normalizedEmail && user.id !== userIdToIgnore
    );
}

app.use(express.json());

// --- Tarea libre 1: Personalizar el mensaje inicial ---
app.get("/", (req, res) => {
    res.json({
        name: "UserManager API",
        version: "1.0.0",
        status: "running",
        author: "Joanne Zamorano", 
        fecha: "11-06-2026"
    });
});

// --- Tarea libre 2: Añadir una segunda ruta temporal ---
app.get("/api/info", (req, res) => {
    res.json({
        project: "UserManager API",
        description: "API REST para gestionar usuarios",
        day: 2,
        technologies: ["Node.js", "Express", "TypeScript"]
    });
});

// --- Dia 3: Añadir ruta health ---
app.get("/api/health", (req, res) => {
        res.status(200).json({
            status: "ok",
            message: "UserManager API funcionando",
            timestamp: new Date().toISOString()
        });
});

// --- Dia 3: Parte libre ---
app.get("/api/ping", (req, res) => {
    res.json({
        message: "Pong"
    });
});

//Dia 4: GET Users
app.get("/api/users", (req, res) => {
    res.status(200).json({
        message: "Listado de usuarios",
        total: users.length,
        data: users
    });
});

//Dia 4: POST Users
app.post("/api/users", (req, res) => {
    const { name, email, password } = req.body;

    if (!isNonEmptyString(name)) {
        return res.status(400).json({
            error: "El nombre debe ser un texto no vacío"
        });
    }

    if (!isNonEmptyString(email)) {
        return res.status(400).json({
        error: "El email debe ser un texto no vacío"
        });
    }

    if (!isNonEmptyString(password)) {
        return res.status(400).json({
            error: "La contraseña debe ser un texto no vacío"
        });
    }

    const cleanName = name.trim();
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = password.trim();

    if (cleanPassword.length < 6) {
        return res.status(400).json({
            error: "La contraseña debe tener al menos 6 caracteres"
        });
    }

    if (!isValidBasicEmail(cleanEmail)) {
        return res.status(400).json({
            error: "El email no tiene un formato válido"
        });
    }

    if (isEmailTaken(cleanEmail)) {
        return res.status(409).json({
            error: "El email ya está registrado"
        });
    }

    const newId = users.length > 0
        ? Math.max(...users.map((user) => user.id)) + 1
        : 1;

    const newUser: User = {
        id: newId,
        name: cleanName,
        email: cleanEmail,
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

//Dia 7: GET Users
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

//Dia 10: PATCH Users
app.patch("/api/users/:id", (req, res) => {
    const idParam = req.params.id;
    const id = Number(idParam);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            error: "El ID debe ser un número",
            received: idParam
        });
    }

    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            error: "Usuario no encontrado",
            id
        });
    }

    const { name, email, isActive } = req.body;

    const hasChanges =
        name !== undefined ||
        email !== undefined ||
        isActive !== undefined;

    if (!hasChanges) {
        return res.status(400).json({
            error: "Debes enviar al menos un campo para actualizar"
        });
    }

    let cleanName: string | undefined;

    if (name !== undefined) {
        if (!isNonEmptyString(name)) {
            return res.status(400).json({
                error: "El nombre debe ser un texto no vacío"
            });
        }

    cleanName = name.trim();
    }

    let cleanEmail: string | undefined;

    if (email !== undefined) {
        if (!isNonEmptyString(email)) {
            return res.status(400).json({
                error: "El email debe ser un texto no vacío"
            });
        }

        cleanEmail = normalizeEmail(email);

        if (!isValidBasicEmail(cleanEmail)) {
            return res.status(400).json({
                error: "El email no tiene un formato válido"
            });
        }

        const emailAlreadyExists = users.some(
            (user) => user.email === cleanEmail && user.id !== id
        );

        if (isEmailTaken(cleanEmail, id)) {
            return res.status(409).json({
                error: "El email ya está registrado"
            });
        }
    }

    if (isActive !== undefined && !isBoolean(isActive)) {
        return res.status(400).json({
            error: "isActive debe ser true o false"
        });
    }

    const currentUser = users[userIndex];

    const updatedUser: User = {
        ...currentUser,
        name: cleanName ?? currentUser.name,
        email: cleanEmail ?? currentUser.email,
        isActive: isActive ?? currentUser.isActive,
        updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;

    return res.status(200).json({
        message: "Usuario actualizado correctamente",
        data: updatedUser
    });
});

//Dia 11: DELETE Users
app.delete("/api/users/:id", (req, res) => {
    const idParam = req.params.id;
    const id = Number(idParam);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            error: "El ID debe ser un número",
            received: idParam
        });
    }

    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            error: "Usuario no encontrado",
            id
        });
    }

    const currentUser = users[userIndex];

    const updatedUser: User = {
        ...currentUser,
        isActive: false,
        updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;

    return res.status(200).json({
        message: "Usuario desactivado correctamente",
        data: updatedUser
    });

    
});


//----------------------------------------------------------
//Dia 4: Prueba libre - GET me
app.get("/api/users/me", (req, res) => {
    res.status(200).json({
        "id": 1,
        "name": "Joanne Zamorano",
        "email": "joa@email.com",
        "role": "USER",
        "isActive": true
    });
});

//Tarea libre 2: Añadir una ruta para cambiar estado
app.patch("/api/users/:id/status", (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    res.status(200).json({
        "message": "Estado de usuario recibido para actualizar",
        "id": "1",
        "isActive": false
    });
});

//Tarea libre 3: Añadir una ruta para cambiar rol
app.patch("/api/users/:id/role", (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    res.status(200).json({
        "message": "Rol de usuario recibido para actualizar",
        "id": "1",
        "role": "ADMIN"
    });
});

//Dia 5 - Paso 3: Crear una ruta para probar body
app.post("/api/debug/body", (req, res) => {
    res.status(200).json({
        message: "Body recibido correctamente",
        body: req.body
    });
});

//Dia 5- Paso 4: Crear una ruta para probar params
app.get("/api/debug/params/:id", (req, res) => {
    res.status(200).json({
        message: "Params recibidos correctamente",
        params: req.params
    });
});

//Dia 5- Paso 5: Crear una ruta para probar query params
app.get("/api/debug/query", (req, res) => {
    res.status(200).json({
        message: "Query params recibidos correctamente",
        query: req.query
    });
});

//Dia 5- Paso 6: Crear una ruta para probar headers
app.get("/api/debug/headers", (req, res) => {
    res.status(200).json({
        message: "Headers recibidos correctamente",
        headers: req.headers
    });
});

//Dia 5- Paso 7: Crear una ruta combinada
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

//Dia 5 - Tarea libre 1: Crear una ruta de búsqueda simulada
app.get("/api/users/search", (req, res) => {
    res.status(200).json({
        "message": "Búsqueda de usuarios",
        "filters": {
            "name": "ana",
            "role": "USER"
        }
    });
});

//Dia 5 - Tarea libre 2: Crear una ruta de cambio de contraseña simulada
app.patch("/api/users/me/password", (req, res) => {
    const { currentPassword, newPassword } = req.body;
    res.status(200).json({
        "message": "Solicitud de cambio de contraseña recibida"
    });
});

//Dia 5 - Tarea libre 3: Leer un header personalizado
app.get("/api/debug/client", (req, res) => {
    const clientHeader = req.headers["x-client-name"];
    res.status(200).json({
        client: clientHeader
    });
});



app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
}); 


//Dia 6 - Paso 6: Crear una ruta temporal para depuración
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