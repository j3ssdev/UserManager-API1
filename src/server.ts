import express, { Request, Response, NextFunction } from "express";
import { healthRouter } from "./routes/health.routes";
import { userRouter } from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración general y middlewares globales
app.use(express.json());
app.use("/api/auth", authRouter);
// Clase personalizada para errores de la aplicación
export class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Rutas principales de la API
app.use("/api/health", healthRouter);
app.use("/api/users", userRouter);

// Middleware 404 para rutas no encontradas
function notFoundMiddleware(req: Request, _res: Response, next: NextFunction) {
  next(
    new AppError("Ruta no encontrada", 404, {
      method: req.method,
      path: req.originalUrl,
    })
  );
}

// Middleware global de errores
function errorMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    error: err.message || "Error interno del servidor",
    statusCode,
    details: err.details,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
}

// Montaje de middlewares de error (deben ir siempre después de las rutas)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});