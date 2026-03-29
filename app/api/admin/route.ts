import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const role = (session.user as any).role
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const [users, programs, payouts] = await Promise.all([
    prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, plan: true, createdAt: true } }),
    prisma.program.findMany({ include: { company: { select: { name: true } }, _count: { select: { memberships: true } } } }),
    prisma.payout.findMany(),
  ])

  const totalRevenue = payouts.reduce((sum, p) => sum + p.amount, 0)

  return NextResponse.json({ users, programs, totalRevenue })
}
