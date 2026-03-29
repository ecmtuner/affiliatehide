import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { customAlphabet } from "nanoid"

const genId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 25)

const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]

function appendUtmParams(destination: string, incoming: URLSearchParams): string {
  const utmPairs: string[] = []
  for (const key of UTM_PARAMS) {
    const val = incoming.get(key)
    if (val) utmPairs.push(`${key}=${encodeURIComponent(val)}`)
  }
  if (utmPairs.length === 0) return destination

  const separator = destination.includes("?") ? "&" : "?"
  return destination + separator + utmPairs.join("&")
}

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const { code } = params

  const link = await prisma.link.findUnique({
    where: { code },
    include: {
      membership: {
        include: {
          program: true,
        },
      },
    },
  })

  if (!link) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  const incomingParams = req.nextUrl.searchParams

  // Feature 10: Link expiry
  if (link.expiresAt && link.expiresAt < new Date()) {
    const expiredUrl = new URL(link.membership.program.websiteUrl)
    expiredUrl.searchParams.set("expired", "1")
    return NextResponse.redirect(expiredUrl.toString())
  }

  // Feature 1: Fraud protection — block self-referrals
  try {
    const session = await getServerSession(authOptions)
    if (session?.user) {
      const loggedInUserId = (session.user as any).id
      if (loggedInUserId === link.membership.affiliateId) {
        // Self-referral: redirect without logging
        const dest = appendUtmParams(link.destinationUrl, incomingParams)
        return NextResponse.redirect(dest)
      }
    }
  } catch {
    // Non-fatal: continue normally if session check fails
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"

  // Feature 1: Duplicate click filtering — same IP within 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const existingClick = await prisma.click.findFirst({
    where: {
      linkId: link.id,
      ip,
      createdAt: { gte: oneDayAgo },
    },
  })

  const isDuplicate = !!existingClick

  // Log click (with isDuplicate flag)
  prisma.click
    .create({
      data: {
        id: genId(),
        linkId: link.id,
        ip,
        userAgent: req.headers.get("user-agent") ?? "",
        referrer: req.headers.get("referer") ?? "",
        isDuplicate,
      },
    })
    .catch(() => {})

  // Feature 3: UTM passthrough
  const destination = appendUtmParams(link.destinationUrl, incomingParams)

  // Set tracking cookie
  const response = NextResponse.redirect(destination)
  response.cookies.set(`aff_${code}`, link.id, {
    maxAge: 60 * 60 * 24 * (link.membership.program.cookieDays || 30),
    httpOnly: true,
    sameSite: "lax",
  })

  return response
}
