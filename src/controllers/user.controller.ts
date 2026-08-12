import { Request, Response, NextFunction } from "express";
import {
    createDebugUserService,
    getActiveUsersService,
    getUserByIdService,
    getUsersService,
    createUserService,
    deactivateUserService,
    listUsersService,
    updateUserService
} from "../services/user.service";
import { AppError } from "../errors/AppError";

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
        const users = await getActiveUsersService();

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
        const users = await getUsersService();

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
        throw new AppError("El ID debe ser un número", 400, {
            received: req.params.id
        });
        }

        const user = await getUserByIdService(id);

        return res.status(200).json({
        message: "Usuario obtenido correctamente",
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
        const createdUser = await createDebugUserService(req.body);

        return res.status(201).json({
        message: "Usuario creado con Prisma",
        data: createdUser
        });
    } catch (error) {
        next(error);
    }
}

//Dia 30-----------------
export async function listUsers(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const users = await listUsersService();

        return res.status(200).json({
        message: "Usuarios obtenidos correctamente",
        total: users.length,
        data: users
        });
    } catch (error) {
        next(error);
    }
}

export async function createUserController(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const createdUser = await createUserService(req.body);

        return res.status(201).json({
        message: "Usuario creado correctamente",
        data: createdUser
        });
    } catch (error) {
        next(error);
    }
}

export async function updateUserController(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
        throw new AppError("El ID debe ser un número", 400, {
            received: req.params.id
        });
        }

        const updatedUser = await updateUserService(id, req.body);

        return res.status(200).json({
        message: "Usuario actualizado correctamente",
        data: updatedUser
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteUserController(
    req: Request,
    res: Response,
    next: NextFunction
    ) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
        throw new AppError("El ID debe ser un número", 400, {
            received: req.params.id
        });
        }

        const deactivatedUser = await deactivateUserService(id);

        return res.status(200).json({
        message: "Usuario desactivado correctamente",
        data: deactivatedUser
        });
    } catch (error) {
        next(error);
    }
}