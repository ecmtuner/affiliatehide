import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, plan: true, paypalEmail: true, createdAt: true },
  })

  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id

  const { name, paypalEmail } = await req.json()
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, paypalEmail },
  })

  return NextResponse.json({ id: user.id, email: user.email, name: user.name, paypalEmail: user.paypalEmail })
}
