import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

//recibe una contraseña en texto plano y devuelve un hash
export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
// No necesitaremos recuperar la contraseña original

export async function comparePassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}