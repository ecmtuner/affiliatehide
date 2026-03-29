import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { generateCode } from "@/lib/utils"
import { customAlphabet } from "nanoid"

const genId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 25)

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id

  const { membershipId, destinationUrl } = await req.json()

  const membership = await prisma.affiliateMembership.findUnique({
    where: { id: membershipId },
  })

  if (!membership || membership.affiliateId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (membership.status !== "approved") {
    return NextResponse.json({ error: "Membership not approved" }, { status: 403 })
  }

  const link = await prisma.link.create({
    data: {
      id: genId(),
      membershipId,
      code: generateCode(),
      destinationUrl: destinationUrl || (await prisma.program.findUnique({ where: { id: membership.programId } }))!.websiteUrl,
    },
  })

  return NextResponse.json(link)
}
