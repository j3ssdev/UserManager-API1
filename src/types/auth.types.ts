import { Request } from "express";
import { Role } from "@prisma/client";

export type AuthenticatedUser = {
  userId: number;
  email: string;
  role: Role;
};

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};