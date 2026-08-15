import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const commonPasswordHash = await bcrypt.hash("123456", SALT_ROUNDS);
  const adminPasswordHash = await bcrypt.hash("admin123", SALT_ROUNDS);
  const userPasswordHash = await bcrypt.hash("user123", SALT_ROUNDS);
  const inactivePasswordHash = await bcrypt.hash("inactive123", SALT_ROUNDS);

  // Lista de usuarios a insertar o actualizar
  const usersData = [
    // --- Usuarios Base Originales ---
    {
      name: "Admin Principal",
      email: "admin@email.com",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      isActive: true
    },
    {
      name: "Usuario Demo",
      email: "user@email.com",
      passwordHash: userPasswordHash,
      role: Role.USER,
      isActive: true
    },
    {
      name: "Usuario Inactivo",
      email: "inactive@email.com",
      passwordHash: inactivePasswordHash,
      role: Role.USER,
      isActive: false
    },

    // --- 10 Usuarios Nuevos ---
    {
      name: "Ana García",
      email: "ana.garcia@email.com",
      passwordHash: commonPasswordHash,
      role: Role.USER,
      isActive: true
    },
    {
      name: "Carlos Mendoza",
      email: "carlos.mendoza@email.com",
      passwordHash: commonPasswordHash,
      role: Role.ADMIN,
      isActive: true
    },
    {
      name: "Lucía Fernández",
      email: "lucia.fernandez@email.com",
      passwordHash: commonPasswordHash,
      role: Role.USER,
      isActive: true
    },
    {
      name: "David Torres",
      email: "david.torres@email.com",
      passwordHash: commonPasswordHash,
      role: Role.USER,
      isActive: false
    },
    {
      name: "Elena Gómez",
      email: "elena.gomez@email.com",
      passwordHash: commonPasswordHash,
      role: Role.USER,
      isActive: true
    },
    {
      name: "Fernando Ruiz",
      email: "fernando.ruiz@email.com",
      passwordHash: commonPasswordHash,
      role: Role.USER,
      isActive: true
    },
    {
      name: "Marta Sánchez",
      email: "marta.sanchez@email.com",
      passwordHash: commonPasswordHash,
      role: Role.ADMIN,
      isActive: true
    },
    {
      name: "Javier López",
      email: "javier.lopez@email.com",
      passwordHash: commonPasswordHash,
      role: Role.USER,
      isActive: false
    },
    {
      name: "Sofia Navarro",
      email: "sofia.navarro@email.com",
      passwordHash: commonPasswordHash,
      role: Role.USER,
      isActive: true
    },
    {
      name: "Diego Romero",
      email: "diego.romero@email.com",
      passwordHash: commonPasswordHash,
      role: Role.USER,
      isActive: true
    }
  ];

  console.log("Iniciando la inserción de usuarios en la semilla...");

  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        passwordHash: userData.passwordHash,
        role: userData.role,
        isActive: userData.isActive
      },
      create: userData
    });
  }

  console.log(`Se han procesado ${usersData.length} usuarios en la semilla con éxito.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Error ejecutando el seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });