import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { generateCode } from "@/lib/utils"
import { customAlphabet } from "nanoid"
import { emailApplicationApproved, emailApplicationRejected } from "@/lib/email"

const genId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 25)

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
  const prevMembership = await prisma.affiliateMembership.findUnique({
    where: { id: params.memberId },
    include: { affiliate: { select: { email: true } } },
  })

  const membership = await prisma.affiliateMembership.update({
    where: { id: params.memberId },
    data: {
      status: body.status,
      customRate: body.customRate !== undefined ? parseFloat(body.customRate) : undefined,
    },
  })

  // If newly approved, auto-generate a link
  if (body.status === "approved" && prevMembership?.status !== "approved") {
    const existingLink = await prisma.link.findFirst({
      where: { membershipId: membership.id },
    })
    if (!existingLink) {
      await prisma.link.create({
        data: {
          id: genId(),
          membershipId: membership.id,
          code: generateCode(),
          destinationUrl: program.websiteUrl,
        },
      })
    }
  }

  // Send email notifications
  const affiliateEmail = prevMembership?.affiliate?.email
  if (affiliateEmail) {
    if (body.status === "approved") {
      emailApplicationApproved(affiliateEmail, program.name).catch(() => {})
    } else if (body.status === "rejected") {
      emailApplicationRejected(affiliateEmail, program.name).catch(() => {})
    }
  }

  return NextResponse.json(membership)
}
