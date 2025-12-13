import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: Number(process.env.PORT) || 5000,
  dbUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
};

export default config;

// Optional helper (named export) for DB connect
export async function connectDB() {
  // If using Prisma
  // const { PrismaClient } = await import('@prisma/client');
  // const prisma = new PrismaClient();
  // await prisma.$connect();
  // return prisma;
  // Or provide a no-op for in-memory fallback:
  return Promise.resolve();
}