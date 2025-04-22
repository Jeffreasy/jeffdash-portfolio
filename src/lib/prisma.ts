import { PrismaClient } from '@prisma/client'

// Voorkom meerdere instanties van Prisma Client in development
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Log the DATABASE_URL to verify it's being read correctly at runtime
console.log('DATABASE_URL:', process.env.DATABASE_URL);

export const prisma =
  global.prisma ||
  new PrismaClient({
    // log: ['query', 'info', 'warn', 'error'], // Uncomment om logs te zien
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma 