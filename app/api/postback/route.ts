import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { customAlphabet } from "nanoid"

const genId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 25)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")
  const amount = parseFloat(searchParams.get("amount") ?? "0")

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 })
  }

  const program = await prisma.program.findUnique({ where: { conversionToken: token } })
  if (!program) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 })
  }

  // Find the most recently clicked link for this program
  const latestClick = await prisma.click.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      link: {
        include: { membership: true },
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

  await prisma.conversion.create({
    data: {
      id: genId(),
      linkId: latestClick.linkId,
      amount,
      status: "pending",
    },
  })

  return NextResponse.json({ success: true })
}
