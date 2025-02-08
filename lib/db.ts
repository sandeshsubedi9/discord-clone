// import {PrismaClient} from '@prisma/client'

// declare global {
//     var prisma: PrismaClient | undefined
// }
// export const db = globalThis.prisma || new PrismaClient()
// if (process.env.NODE_ENV !== 'production') globalThis.prisma = db

// import { PrismaClient } from '@prisma/client'

// // Declare global type for prisma client to avoid 'no-var' error and access it globally.
// const globalForPrisma = global as unknown as NodeJS.Global & typeof globalThis & { prisma?: PrismaClient };

// export const db = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;


import { PrismaClient } from '@prisma/client';

declare global {
    // Extending the global interface to include the `prisma` property
    namespace NodeJS {
        interface Global {
            prisma: PrismaClient;
        }
    }
}

// Assigning the PrismaClient instance to the global object
const globalForPrisma = global as typeof global & {
    prisma?: PrismaClient
};

export const db = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
