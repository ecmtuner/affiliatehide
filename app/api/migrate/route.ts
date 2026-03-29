import { NextResponse } from "next/server"
import pg from "pg"

const { Client } = pg

export async function GET() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  const results: string[] = []

  const statements = [
    `CREATE TABLE IF NOT EXISTS "User" (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      name TEXT,
      role TEXT NOT NULL DEFAULT 'affiliate',
      plan TEXT,
      "stripeCustomerId" TEXT,
      "stripeSubscriptionId" TEXT,
      "paypalEmail" TEXT,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS "Program" (
      id TEXT PRIMARY KEY,
      "companyId" TEXT NOT NULL REFERENCES "User"(id),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      "websiteUrl" TEXT NOT NULL,
      "logoUrl" TEXT,
      "baseRate" FLOAT NOT NULL DEFAULT 10,
      "rateType" TEXT NOT NULL DEFAULT 'percent',
      "cookieDays" INT NOT NULL DEFAULT 30,
      "autoApprove" BOOLEAN NOT NULL DEFAULT false,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "conversionToken" TEXT UNIQUE NOT NULL,
      "payoutThreshold" FLOAT NOT NULL DEFAULT 50,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS "AffiliateMembership" (
      id TEXT PRIMARY KEY,
      "affiliateId" TEXT NOT NULL REFERENCES "User"(id),
      "programId" TEXT NOT NULL REFERENCES "Program"(id),
      status TEXT NOT NULL DEFAULT 'pending',
      "customRate" FLOAT,
      "joinedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE("affiliateId", "programId")
    )`,
    `CREATE TABLE IF NOT EXISTS "Link" (
      id TEXT PRIMARY KEY,
      "membershipId" TEXT NOT NULL REFERENCES "AffiliateMembership"(id),
      code TEXT UNIQUE NOT NULL,
      "destinationUrl" TEXT NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS "Click" (
      id TEXT PRIMARY KEY,
      "linkId" TEXT NOT NULL REFERENCES "Link"(id),
      ip TEXT,
      "userAgent" TEXT,
      referrer TEXT,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS "Conversion" (
      id TEXT PRIMARY KEY,
      "linkId" TEXT NOT NULL REFERENCES "Link"(id),
      amount FLOAT NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS "Payout" (
      id TEXT PRIMARY KEY,
      "affiliateId" TEXT NOT NULL REFERENCES "User"(id),
      "programId" TEXT NOT NULL REFERENCES "Program"(id),
      amount FLOAT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      "paidAt" TIMESTAMP WITH TIME ZONE,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`,
    `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "paypalEmail" TEXT`,
    `ALTER TABLE "Program" ADD COLUMN IF NOT EXISTS "payoutThreshold" FLOAT DEFAULT 50`,
  ]

  for (const sql of statements) {
    try {
      await client.query(sql)
      results.push("OK: " + sql.slice(0, 60))
    } catch (e: any) {
      results.push("ERR: " + e.message)
    }
  }

  await client.end()
  return NextResponse.json({ results })
}
