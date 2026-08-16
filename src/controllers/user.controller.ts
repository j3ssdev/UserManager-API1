import { Request, Response, NextFunction } from "express";
import { parseIdParam } from "../utils/parse.utils";
import { AppError } from "../errors/AppError";
import { AuthenticatedRequest } from "../types/auth.types";
import {
  createUserService,
  deactivateUserService,
  getCurrentUserService,
  getUserByIdService,
  listUsersService,
  updateUserService
} from "../services/user.service";

export async function listUsers(
  _req: Request,
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

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseIdParam(req.params.id as string);
    const user = await getUserByIdService(id);
    return res.status(200).json({
      message: "Usuario obtenido correctamente",
      data: user
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
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseIdParam(req.params.id as string);

    if (
      req.user?.role !== "ADMIN" &&
      Object.prototype.hasOwnProperty.call(req.body, "isActive")
    ) {
      throw new AppError(
        "Solo un ADMIN puede cambiar el estado de un usuario",
        403
      );
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
    const id = parseIdParam(req.params.id as string);
    const deactivatedUser = await deactivateUserService(id);
    return res.status(200).json({
      message: "Usuario desactivado correctamente",
      data: deactivatedUser
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const user = await getCurrentUserService(req.user.userId);

    return res.status(200).json({
      message: "Usuario autenticado obtenido correctamente",
      data: user
    });
  } catch (error) {
    next(error);
  }
}