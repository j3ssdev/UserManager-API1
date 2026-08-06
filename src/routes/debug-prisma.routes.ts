import { Router } from "express";
import {
  createDebugUser,
  getActiveUsers,
  getUserById,
  getUsers
} from "../controllers/user.controller";

export const debugPrismaRouter = Router();

debugPrismaRouter.get("/users-active", getActiveUsers);

debugPrismaRouter.get("/users", getUsers);

debugPrismaRouter.get("/users/:id", getUserById);

debugPrismaRouter.post("/users", createDebugUser);
