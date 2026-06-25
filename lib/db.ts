import { PrismaClient } from '@prisma/client';

// Singleton para evitar múltiples instancias de PrismaClient en desarrollo
// (hot-reload) y reaprovechar conexiones en serverless.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
