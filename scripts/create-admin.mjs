import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const [email, name] = process.argv.slice(2);
const password = process.env.ADMIN_INITIAL_PASSWORD;
if (!email || !name || !password || password.length < 12) {
  console.error("Uso: ADMIN_INITIAL_PASSWORD=<senha de 12+ caracteres> pnpm admin:create email@dominio Nome");
  process.exit(1);
}
const prisma = new PrismaClient();
try {
  await prisma.adminUser.upsert({ where: { email: email.toLowerCase() }, update: { name, passwordHash: await hash(password, 12), role: "ADMIN" }, create: { email: email.toLowerCase(), name, passwordHash: await hash(password, 12), role: "ADMIN" } });
  console.log("Administrador criado ou atualizado.");
} finally { await prisma.$disconnect(); }
