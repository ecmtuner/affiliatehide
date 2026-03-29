import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const program = await prisma.program.findUnique({
    where: { id: params.id },
    include: {
      company: { select: { name: true, email: true } },
      memberships: {
        include: {
          affiliate: { select: { id: true, name: true, email: true, paypalEmail: true } },
          links: {
            include: {
              _count: { select: { clicks: true, conversions: true } },
            },
          },
        },
      },
    },
  })

  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(program)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const program = await prisma.program.findUnique({ where: { id: params.id } })
  if (!program || program.companyId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const updated = await prisma.program.update({
    where: { id: params.id },
    data: {
      name: body.name,
      description: body.description,
      websiteUrl: body.websiteUrl,
      logoUrl: body.logoUrl,
      baseRate: body.baseRate ? parseFloat(body.baseRate) : undefined,
      rateType: body.rateType,
      cookieDays: body.cookieDays ? parseInt(body.cookieDays) : undefined,
      autoApprove: body.autoApprove,
      isActive: body.isActive,
      payoutThreshold: body.payoutThreshold ? parseFloat(body.payoutThreshold) : undefined,
    },
  })
  return NextResponse.json(updated)
}
