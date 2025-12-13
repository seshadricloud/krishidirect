// This file defines the Product model for the KrishiDirect application using Prisma.
// It includes the schema for the Product entity, which can be used for database operations.



/**
 * Product model (in-memory fallback).
 * - Uses a dynamic import of @prisma/client if available to avoid hard compile-time failures.
 * - Provides getAll/getById/create/update/delete stubs backed by an in-memory store.
 */

export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  category?: string;
  image?: string;
  location?: string;
  userId: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

let prismaClient: any = null;
async function tryInitPrisma() {
  if (prismaClient) return prismaClient;
  try {
    const mod = await import('@prisma/client');
    prismaClient = new mod.PrismaClient();
    return prismaClient;
  } catch {
    // Prisma not installed or not desired in this environment
    return null;
  }
}

const products: Product[] = [];

export default {
  getAll: async (): Promise<Product[]> => {
    const prisma = await tryInitPrisma();
    if (prisma) {
      return prisma.product.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }
    return products.slice();
  },

  getById: async (id: string): Promise<Product | null> => {
    const prisma = await tryInitPrisma();
    if (prisma) {
      return prisma.product.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        }
      });
    }
    return products.find((p) => p.id === id) ?? null;
  },

  create: async (payload: Omit<Product, 'id'>): Promise<Product> => {
    const prisma = await tryInitPrisma();
    if (prisma) {
      return prisma.product.create({ data: payload });
    }
    const newProduct: Product = { id: String(Date.now()), ...payload };
    products.push(newProduct);
    return newProduct;
  },

  update: async (id: string, patch: Partial<Product>): Promise<Product | null> => {
    const prisma = await tryInitPrisma();
    if (prisma) {
      return prisma.product.update({ where: { id }, data: patch });
    }
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...patch };
    return products[idx];
  },

  delete: async (id: string): Promise<boolean> => {
    const prisma = await tryInitPrisma();
    if (prisma) {
      await prisma.product.delete({ where: { id } });
      return true;
    }
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    products.splice(idx, 1);
    return true;
  },
};