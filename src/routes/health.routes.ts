// dia 27-Paso4 la ruta dice: cuando llegue a la ruta /health, ejecuta la función getHealth del controlador health.controller.ts
import { Router } from "express";
import { getHealth } from "../controllers/health.controller";

export const healthRouter = Router();

healthRouter.get("/", getHealth);