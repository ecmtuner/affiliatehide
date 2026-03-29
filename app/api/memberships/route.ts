import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { generateCode } from "@/lib/utils"
import { customAlphabet } from "nanoid"

const genId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 25)

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id

  const memberships = await prisma.affiliateMembership.findMany({
    where: { affiliateId: userId },
    include: {
      program: {
        include: { company: { select: { name: true } } },
      },
      links: {
        include: {
          _count: { select: { clicks: true, conversions: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  })

  return NextResponse.json(memberships)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id

  const { programId } = await req.json()
  if (!programId) return NextResponse.json({ error: "Program ID required" }, { status: 400 })

  const program = await prisma.program.findUnique({ where: { id: programId } })
  if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 })

  const existing = await prisma.affiliateMembership.findUnique({
    where: { affiliateId_programId: { affiliateId: userId, programId } },
  })
  if (existing) return NextResponse.json({ error: "Already applied" }, { status: 400 })

  const status = program.autoApprove ? "approved" : "pending"
  const membership = await prisma.affiliateMembership.create({
    data: {
      id: genId(),
      affiliateId: userId,
      programId,
      status,
    },
  })

  // Auto-generate link if approved
  if (status === "approved") {
    await prisma.link.create({
      data: {
        id: genId(),
        membershipId: membership.id,
        code: generateCode(),
        destinationUrl: program.websiteUrl,
      },
    })
  }

  return NextResponse.json(membership)
}
