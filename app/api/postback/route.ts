import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { customAlphabet } from "nanoid"
import { emailConversionEarned } from "@/lib/email"
import { deliverWebhook } from "@/lib/webhook"
import { getEffectiveRate } from "@/lib/commission"

const genId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 25)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")
  const amount = parseFloat(searchParams.get("amount") ?? "0")

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }

  const program = await prisma.program.findUnique({
    where: { conversionToken: token },
    include: { company: { select: { plan: true } } },
  })
  if (!program) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 })
  }

  // Find the most recently clicked link for this program (non-duplicate clicks preferred)
  const latestClick = await prisma.click.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      link: {
        include: {
          membership: {
            include: {
              affiliate: { select: { id: true, email: true, name: true } },
            },
          },
        },
      },
    },
    where: {
      link: {
        membership: { programId: program.id },
      },
    },
  })

  if (!latestClick) {
    return NextResponse.json({ message: "No recent click found" })
  }

  const membership = latestClick.link.membership
  const affiliate = membership.affiliate

  // Calculate commission using tiers
  const { rate, type } = await getEffectiveRate(membership.id, program.id, affiliate.id)
  const commission =
    type === "percent" ? (amount * rate) / 100 : rate

  const conversion = await prisma.conversion.create({
    data: {
      id: genId(),
      linkId: latestClick.linkId,
      amount: commission,
      status: "pending",
    },
  })

  // Email the affiliate
  if (affiliate.email && commission > 0) {
    emailConversionEarned(affiliate.email, commission, program.name).catch(() => {})
  }

  // Deliver webhook if program has one and company is on Pro plan
  if (program.webhookUrl && program.company.plan === "pro") {
    deliverWebhook(program.webhookUrl, program.id, latestClick.link.code, commission).catch(() => {})
  }

  return NextResponse.json({ success: true, commission })
}
