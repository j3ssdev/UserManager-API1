import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from '@prisma/client';

// Paso 11: Importar bcrypt en el seed
import bcrypt from "bcrypt";

// Paso 12: Crear constante SALT_ROUNDS
const SALT_ROUNDS = 10;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Paso 13: Generar hashes iniciales dentro de main
  const adminPasswordHash = await bcrypt.hash("admin123", SALT_ROUNDS);
  const userPasswordHash = await bcrypt.hash("user123", SALT_ROUNDS);
  const inactivePasswordHash = await bcrypt.hash("inactive123", SALT_ROUNDS);

  // Paso 14 y 15: Actualizar usuarios existentes y sustituir hashes temporales
  const admin = await prisma.user.upsert({
    where: { email: "admin@email.com" },
    update: {
      passwordHash: adminPasswordHash
    },
    create: {
      name: "Admin Principal",
      email: "admin@email.com",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      isActive: true
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "user@email.com" },
    update: {
      passwordHash: userPasswordHash
    },
    create: {
      name: "Usuario Demo",
      email: "user@email.com",
      passwordHash: userPasswordHash,
      role: Role.USER,
      isActive: true
    }
  });

  const inactiveUser = await prisma.user.upsert({
    where: { email: "inactive@email.com" },
    update: {
      passwordHash: inactivePasswordHash
    },
    create: {
      name: "Usuario Inactivo",
      email: "inactive@email.com",
      passwordHash: inactivePasswordHash,
      role: Role.USER,
      isActive: false
    }
  });

  console.log("Seed ejecutado correctamente:");
  console.log({ admin, user, inactiveUser });
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
