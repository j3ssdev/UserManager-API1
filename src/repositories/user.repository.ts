import { Role } from "@prisma/client";
import { prisma } from "../prisma";

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

const userWithPasswordSelect = {
  id: true,
  name: true,
  email: true,
  passwordHash: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true
} as const;

type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
  role?: Role;
  isActive?: boolean;
};

type UpdateUserData = {
  name?: string;
  email?: string;
  isActive?: boolean;
};

export function findAllUsers() {
  return prisma.user.findMany({
    select: userSafeSelect,
    orderBy: {
      id: "asc",
    },
  });
}

// FIX: Función que te faltaba
export function findActiveUsers() {
  return prisma.user.findMany({
    where: {
      isActive: true,
    },
    select: userSafeSelect,
    orderBy: {
      id: "asc",
    },
  });
}

export function findUserById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: userSafeSelect,
  });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: userSafeSelect,
  });
}

// Paso 4: Crear findUserByEmailWithPassword
export function findUserByEmailWithPassword(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: userWithPasswordSelect,
  });
}

export function createUser(data: CreateUserData) {
  return prisma.user.create({
    data,
    select: userSafeSelect,
  });
}

export function updateUser(id: number, data: UpdateUserData) {
  return prisma.user.update({
    where: {
      id,
    },
    data,
    select: userSafeSelect,
  });
}

export function deactivateUser(id: number) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
    select: userSafeSelect,
  });
}

