import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { generateSlug, generateToken } from "@/lib/utils"
import { customAlphabet } from "nanoid"

const genId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 25)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mine = searchParams.get("mine")
  const session = await getServerSession(authOptions)

  if (mine && session?.user) {
    const userId = (session.user as any).id
    const programs = await prisma.program.findMany({
      where: { companyId: userId },
      include: {
        _count: { select: { memberships: true } },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(programs)
  }

  // Public listing
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    include: {
      company: { select: { name: true } },
      _count: { select: { memberships: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(programs)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user?.role !== "company") return NextResponse.json({ error: "Companies only" }, { status: 403 })

  const body = await req.json()
  const { name, description, websiteUrl, logoUrl, baseRate, rateType, cookieDays, autoApprove, payoutThreshold } = body

  if (!name || !websiteUrl) {
    return NextResponse.json({ error: "Name and website URL required" }, { status: 400 })
  }

  let slug = generateSlug(name)
  const existing = await prisma.program.findUnique({ where: { slug } })
  if (existing) slug = slug + "-" + Date.now()

  const program = await prisma.program.create({
    data: {
      id: genId(),
      companyId: userId,
      name,
      slug,
      description,
      websiteUrl,
      logoUrl,
      baseRate: parseFloat(baseRate) || 10,
      rateType: rateType || "percent",
      cookieDays: parseInt(cookieDays) || 30,
      autoApprove: autoApprove === true || autoApprove === "true",
      payoutThreshold: parseFloat(payoutThreshold) || 50,
      conversionToken: generateToken(),
    },
  })

  return NextResponse.json(program)
}
