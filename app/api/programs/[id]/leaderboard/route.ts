import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const program = await prisma.program.findUnique({ where: { id: params.id } })
  if (!program || program.companyId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const memberships = await prisma.affiliateMembership.findMany({
    where: { programId: params.id, status: "approved" },
    include: {
      affiliate: { select: { id: true, name: true, email: true } },
      links: {
        include: {
          _count: { select: { clicks: true, conversions: true } },
          conversions: { select: { amount: true, status: true } },
        },
      },
    },
  })

  const leaderboard = memberships
    .map((m) => {
      const totalClicks = m.links.reduce((s, l) => s + l._count.clicks, 0)
      const totalConversions = m.links.reduce((s, l) => s + l._count.conversions, 0)
      const totalEarnings = m.links.reduce(
        (s, l) => s + l.conversions.reduce((cs, c) => cs + c.amount, 0),
        0
      )
      return {
        affiliateId: m.affiliateId,
        affiliateName: m.affiliate.name ?? m.affiliate.email,
        totalClicks,
        totalConversions,
        totalEarnings,
      }
    })
    .sort((a, b) => {
      if (b.totalConversions !== a.totalConversions) return b.totalConversions - a.totalConversions
      return b.totalClicks - a.totalClicks
    })
    .slice(0, 10)
    .map((entry, index) => ({ rank: index + 1, ...entry }))

  return NextResponse.json(leaderboard)
}
