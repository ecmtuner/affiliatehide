import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { customAlphabet } from "nanoid"

const genId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 25)

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, referredBy } = await req.json()

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Validate referredBy if provided
    let validReferredBy: string | null = null
    if (referredBy) {
      const referrer = await prisma.user.findUnique({ where: { id: referredBy } })
      if (referrer) validReferredBy = referredBy
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        id: genId(),
        email,
        name,
        password: hashed,
        role: role || "affiliate",
        referredBy: validReferredBy,
      },
    })

    return NextResponse.json({ id: user.id, email: user.email })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
