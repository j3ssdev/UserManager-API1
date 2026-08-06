import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";

const userSafeSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    isActive: true,
    createdAt: true,
    updatedAt: true
} as const;

export async function getActiveUsers(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const users = await prisma.user.findMany({
        where: {
            isActive: true
        },
        select: userSafeSelect,
        orderBy: {
            id: "asc"
        }
        });

        return res.status(200).json({
        message: "Usuarios activos obtenidos con Prisma",
        total: users.length,
        data: users
        });
    } catch (error) {
        next(error);
    }
}

export async function getUsers(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const users = await prisma.user.findMany({
        select: userSafeSelect,
        orderBy: {
            id: "asc"
        }
        });

        return res.status(200).json({
        message: "Usuarios obtenidos con Prisma",
        total: users.length,
        data: users
        });
    } catch (error) {
        next(error);
    }
}

export async function getUserById(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
        return res.status(400).json({
            error: "El ID debe ser un número"
        });
        }

        const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: userSafeSelect
        });

        if (!user) {
        return res.status(404).json({
            error: "Usuario no encontrado"
        });
        }

        return res.status(200).json({
        message: "Usuario encontrado con Prisma",
        data: user
        });
    } catch (error) {
        next(error);
    }
}

export async function createDebugUser(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
        return res.status(400).json({
            error: "name, email y password son obligatorios"
        });
        }

        const cleanName = String(name).trim();
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanPassword = String(password).trim();

        if (cleanName.length === 0) {
        return res.status(400).json({
            error: "El nombre no puede estar vacío"
        });
        }

        if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
        return res.status(400).json({
            error: "El email no tiene un formato válido"
        });
        }

        if (cleanPassword.length < 6) {
        return res.status(400).json({
            error: "La contraseña debe tener al menos 6 caracteres"
        });
        }

        const createdUser = await prisma.user.create({
        data: {
            name: cleanName,
            email: cleanEmail,
            passwordHash: `hash_temporal_${cleanPassword}`
        },
        select: userSafeSelect
        });

        return res.status(201).json({
        message: "Usuario creado con Prisma",
        data: createdUser
        });
    } catch (error: any) {
        if (error.code === "P2002") {
        return res.status(409).json({
            error: "El email ya está registrado"
        });
        }

        next(error);
    }
}
