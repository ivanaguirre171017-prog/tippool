import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma in serverless environments
// This prevents creating too many database connections
declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
    log: ['error'],
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

// Ensure connection is closed after each invocation in serverless
export const disconnectPrisma = async () => {
    await prisma.$disconnect();
};
