import Stripe from "stripe"

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_placeholder", {
    apiVersion: "2025-02-24.acacia",
  })
}

export const stripe = getStripe()

export const PLANS = {
  starter: {
    name: "Starter",
    price: 29,
    priceId: process.env.STRIPE_STARTER_PRICE_ID ?? "",
    affiliates: 25,
    programs: 1,
  },
  growth: {
    name: "Growth",
    price: 79,
    priceId: process.env.STRIPE_GROWTH_PRICE_ID ?? "",
    affiliates: 250,
    programs: 5,
  },
  pro: {
    name: "Pro",
    price: 199,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
    affiliates: -1,
    programs: -1,
  },
}
