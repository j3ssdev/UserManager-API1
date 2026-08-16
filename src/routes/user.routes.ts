import { Router } from "express";
import { Role } from "@prisma/client";
import {
  createUserController,
  deleteUserController,
  getCurrentUser,
  getUserById,
  listUsers,
  updateUserController
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  requireRole,
  requireSelfOrAdmin
} from "../middlewares/role.middleware";

export const userRouter = Router();

// Middleware de autenticación global para este router
userRouter.use(authMiddleware);

// Rutas específicas (deben ir ANTES de las rutas con parámetros como /:id)
userRouter.get("/me", getCurrentUser);

// Rutas de administración
userRouter.get("/", requireRole(Role.ADMIN), listUsers);
userRouter.post("/", requireRole(Role.ADMIN), createUserController);

// Rutas con ID dinámico
userRouter.get("/:id", requireSelfOrAdmin, getUserById);
userRouter.patch("/:id", requireSelfOrAdmin, updateUserController);
userRouter.delete("/:id", requireRole(Role.ADMIN), deleteUserController);