import express, { Request, Response, NextFunction } from "express";
import { healthRouter } from "./routes/health.routes";
import { userRouter } from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:3001"
    })
);

app.use("/api/health", healthRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
    next(
        new AppError("Ruta no encontrada", 404, {
            method: req.method,
            path: req.originalUrl
        })
    );
}

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
        timestamp: new Date().toISOString()
    });
}
//----------------------------------------
class AppError extends Error {
    statusCode: number;
    details?: unknown;

    constructor(message: string, statusCode: number = 500, details?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
}); 