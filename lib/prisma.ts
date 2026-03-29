import { PrismaClient } from "../generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const { Pool } = pg

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter } as any)
}

const prisma = global.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") global.prisma = prisma

export default prisma
