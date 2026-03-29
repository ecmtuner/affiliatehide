import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { customAlphabet } from "nanoid"

const genId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 25)

// 1x1 transparent GIF
const GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
)

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  // Strip .gif extension if present
  const code = params.code.replace(/\.gif$/, "")

  const link = await prisma.link.findUnique({ where: { code } })

  if (link) {
    prisma.conversion
      .create({
        data: {
          id: genId(),
          linkId: link.id,
          amount: 0,
          status: "pending",
        },
      })
      .catch(() => {})
  }

  return new NextResponse(GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}
