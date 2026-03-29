import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { customAlphabet } from "nanoid"

const genId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 25)

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id
  const role = (session.user as any).role
  const { searchParams } = new URL(req.url)
  const csv = searchParams.get("csv")
  const programId = searchParams.get("programId")

  let where: any = {}
  if (role === "company") {
    const programs = await prisma.program.findMany({ where: { companyId: userId }, select: { id: true } })
    const programIds = programs.map((p) => p.id)
    where = { programId: { in: programIds } }
    if (programId) where.programId = programId
  } else {
    where = { affiliateId: userId }
  }

  const payouts = await prisma.payout.findMany({
    where,
    include: {
      affiliate: { select: { name: true, email: true, paypalEmail: true } },
      program: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  if (csv === "1") {
    const rows = [
      ["ID", "Affiliate", "Email", "PayPal", "Program", "Amount", "Status", "Created"].join(","),
      ...payouts.map((p) =>
        [
          p.id,
          `"${p.affiliate.name ?? ""}"`,
          p.affiliate.email,
          p.affiliate.paypalEmail ?? "",
          `"${p.program.name}"`,
          p.amount.toFixed(2),
          p.status,
          p.createdAt.toISOString().slice(0, 10),
        ].join(",")
      ),
    ].join("\n")

    return new NextResponse(rows, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="payouts-${Date.now()}.csv"`,
      },
    })
  }

  return NextResponse.json(payouts)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id
  const role = (session.user as any).role

  if (role !== "company") return NextResponse.json({ error: "Companies only" }, { status: 403 })

  const { affiliateId, programId, amount } = await req.json()
  const payout = await prisma.payout.create({
    data: {
      id: genId(),
      affiliateId,
      programId,
      amount: parseFloat(amount),
    },
  })
  return NextResponse.json(payout)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, status } = await req.json()
  const payout = await prisma.payout.update({
    where: { id },
    data: { status, paidAt: status === "paid" ? new Date() : undefined },
  })
  return NextResponse.json(payout)
}
