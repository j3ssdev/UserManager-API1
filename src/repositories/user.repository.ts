import { Role } from "@prisma/client";
import { prisma } from "../prisma";

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
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

export function findAllUsers() {
  return prisma.user.findMany({
    select: userSafeSelect,
    orderBy: {
      id: "asc"
    }
  });
}

export function findActiveUsers() {
  return prisma.user.findMany({
    where: {
      isActive: true
    },
    select: userSafeSelect,
    orderBy: {
      id: "asc"
    }
  });
}

export function findUserById(id: number) {
  return prisma.user.findUnique({
    where: {
      id
    },
    select: userSafeSelect
  });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email
    },
    select: userSafeSelect
  });
}

export function createUser(data: CreateUserData) {
  return prisma.user.create({
    data,
    select: userSafeSelect
  });
}


