import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      plan: true,
      paypalEmail: true,
      referredBy: true,
    },
  })

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Count referred users
  const referredCount = await prisma.user.count({
    where: { referredBy: userId },
  })

  return NextResponse.json({ ...user, referredCount })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id

  const body = await req.json()
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      paypalEmail: body.paypalEmail,
      name: body.name,
    },
  })

  return NextResponse.json({ id: updated.id, email: updated.email, paypalEmail: updated.paypalEmail })
}
