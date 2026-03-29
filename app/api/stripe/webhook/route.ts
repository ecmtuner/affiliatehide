import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") ?? ""

  let event: any
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "")
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const { userId, plan } = session.metadata ?? {}
    if (userId && plan) {
      await prisma.user.update({
        where: { id: userId },
        data: { plan, stripeSubscriptionId: session.subscription },
      })
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object
    await prisma.user.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: { plan: null, stripeSubscriptionId: null },
    })
  }

  return NextResponse.json({ received: true })
}
