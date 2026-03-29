import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const program = await prisma.program.findUnique({ where: { id: params.id } })
  if (!program || program.companyId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const membership = await prisma.affiliateMembership.update({
    where: { id: params.memberId },
    data: {
      status: body.status,
      customRate: body.customRate !== undefined ? parseFloat(body.customRate) : undefined,
    },
  })

  return NextResponse.json(membership)
}
