import { Request, Response } from "express";

export function getHealth(req: Request, res: Response) {
  return res.status(200).json({
    status: "ok",
    message: "UserManager API funcionando",
    timestamp: new Date().toISOString()
  });
}