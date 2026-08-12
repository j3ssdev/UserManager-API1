import { AppError } from "../errors/AppError";
import {
    createUser,
    deactivateUser,
    findAllUsers,
    findUserByEmail,
    findUserById,
    updateUser,
    findActiveUsers
} from "../repositories/user.repository";

//-------------------------------
type CreateDebugUserInput = {
    name: unknown;
    email: unknown;
    password: unknown;
};

type CreateUserInput = {
    name: unknown;
    email: unknown;
    password: unknown;
};

type UpdateUserInput = {
    name?: unknown;
    email?: unknown;
    isActive?: unknown;
};

//-------------------------------

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}

function isValidBasicEmail(email: string): boolean {
    return email.includes("@") && email.includes(".");
}

//---------------------

export async function listUsersService() {
    return findAllUsers();
}

export async function getUsersService() {
    return listUsersService();
}

export async function getActiveUsersService() {
    return findActiveUsers();
}

export async function getUserByIdService(id: number) {
    const user = await findUserById(id);

    if (!user) {
        throw new AppError("Usuario no encontrado", 404, { id });
    }

    return user;
}


export async function createUserService(input: CreateUserInput) {
    const { name, email, password } = input;

    if (!isNonEmptyString(name)) {
        throw new AppError("El nombre debe ser un texto no vacío", 400);
    }
    if (!isNonEmptyString(email)) {
        throw new AppError("El email debe ser un texto no vacío", 400);
    }
    if (!isNonEmptyString(password)) {
        throw new AppError("La contraseña debe ser un texto no vacío", 400);
    }

    const cleanName = name.trim();
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = password.trim();

    if (!isValidBasicEmail(cleanEmail)) {
        throw new AppError("El email no tiene un formato válido", 400);
    }
    if (cleanPassword.length < 6) {
        throw new AppError("La contraseña debe tener al menos 6 caracteres", 400);
    }

    const existingUser = await findUserByEmail(cleanEmail);

    if (existingUser) {
        throw new AppError("El email ya está registrado", 409, {
        email: cleanEmail
        });
    }

    return createUser({
        name: cleanName,
        email: cleanEmail,
        passwordHash: `hash_temporal_${cleanPassword}`
    });
}

export async function updateUserService(id: number, input: UpdateUserInput) {
    const currentUser = await findUserById(id);

    if (!currentUser) {
        throw new AppError("Usuario no encontrado", 404, { id });
    }

    const dataToUpdate: {
        name?: string;
        email?: string;
        isActive?: boolean;
    } = {};

    if (input.name !== undefined) {
        if (!isNonEmptyString(input.name)) {
        throw new AppError("El nombre debe ser un texto no vacío", 400);
        }

        dataToUpdate.name = input.name.trim();
    }

    if (input.email !== undefined) {
        if (!isNonEmptyString(input.email)) {
        throw new AppError("El email debe ser un texto no vacío", 400);
        }

        const cleanEmail = normalizeEmail(input.email);

        if (!isValidBasicEmail(cleanEmail)) {
        throw new AppError("El email no tiene un formato válido", 400);
        }

        const existingUser = await findUserByEmail(cleanEmail);

        if (existingUser && existingUser.id !== id) {
        throw new AppError("El email ya está registrado", 409, {
            email: cleanEmail
        });
        }

        dataToUpdate.email = cleanEmail;
    }

    if (input.isActive !== undefined) {
        if (typeof input.isActive !== "boolean") {
        throw new AppError("isActive debe ser true o false", 400);
        }

        dataToUpdate.isActive = input.isActive;
    }

    const hasChanges = Object.keys(dataToUpdate).length > 0;

    if (!hasChanges) {
        throw new AppError("Debes enviar al menos un campo para actualizar", 400);
    }

    return updateUser(id, dataToUpdate);
}

export async function deactivateUserService(id: number) {
    const user = await findUserById(id);

    if (!user) {
        throw new AppError("Usuario no encontrado", 404, { id });
    }
    if (!user.isActive) {
        throw new AppError("El usuario ya estaba desactivado", 409, { id });
    }

    return deactivateUser(id);
}



// Debug:-----------------
export async function createDebugUserService(input: CreateDebugUserInput) {
    const { name, email, password } = input;

    if (!isNonEmptyString(name)) {
        throw new AppError("El nombre debe ser un texto no vacío", 400);
    }
    if (!isNonEmptyString(email)) {
        throw new AppError("El email debe ser un texto no vacío", 400);
    }
    if (!isNonEmptyString(password)) {
        throw new AppError("La contraseña debe ser un texto no vacío", 400);
    }

    const cleanName = name.trim();
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = password.trim();

    if (!isValidBasicEmail(cleanEmail)) {
        throw new AppError("El email no tiene un formato válido", 400);
    }
    if (cleanPassword.length < 6) {
        throw new AppError("La contraseña debe tener al menos 6 caracteres", 400);
    }
    const existingUser = await findUserByEmail(cleanEmail);
    if (existingUser) {
        throw new AppError("El email ya está registrado", 409, {
        email: cleanEmail
        });
    }

    return createUser({
        name: cleanName,
        email: cleanEmail,
        passwordHash: `hash_temporal_${cleanPassword}`
    });
}