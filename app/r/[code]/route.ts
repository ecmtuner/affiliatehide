import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { customAlphabet } from "nanoid"

const genId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 25)

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params

  const link = await prisma.link.findUnique({ where: { code } })

  if (!link) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Log click asynchronously (don't await)
  prisma.click
    .create({
      data: {
        id: genId(),
        linkId: link.id,
        ip: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown",
        userAgent: req.headers.get("user-agent") ?? "",
        referrer: req.headers.get("referer") ?? "",
      },
    })
    .catch(() => {})

  // Set tracking cookie
  const response = NextResponse.redirect(link.destinationUrl)
  response.cookies.set(`aff_${code}`, link.id, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  })

  return response
}
