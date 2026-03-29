import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const program = await prisma.program.findUnique({
    where: { slug: params.slug, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      websiteUrl: true,
      logoUrl: true,
      baseRate: true,
      rateType: true,
      cookieDays: true,
      company: { select: { name: true } },
    },
  })

  if (!program) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(program)
}
