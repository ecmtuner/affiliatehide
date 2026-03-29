import Link from "next/link"
import { Navbar } from "@/components/Navbar"

const plans = [
  {
    name: "Starter",
    price: 29,
    affiliates: 25,
    programs: 1,
    features: [
      "25 affiliates",
      "1 affiliate program",
      "Real-time click tracking",
      "Link cloaking",
      "CSV payout exports",
      "Email support",
    ],
    popular: false,
    planKey: "starter",
  },
  {
    name: "Growth",
    price: 79,
    affiliates: 250,
    programs: 5,
    features: [
      "250 affiliates",
      "5 affiliate programs",
      "Everything in Starter",
      "Custom per-affiliate rates",
      "Pixel tracking",
      "Postback URL integration",
      "Priority support",
    ],
    popular: true,
    planKey: "growth",
  },
  {
    name: "Pro",
    price: 199,
    affiliates: -1,
    programs: -1,
    features: [
      "Unlimited affiliates",
      "Unlimited programs",
      "Everything in Growth",
      "API access",
      "White-label dashboard",
      "Dedicated account manager",
    ],
    popular: false,
    planKey: "pro",
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-white mb-4">Simple, transparent pricing</h1>
          <p className="text-gray-400 text-lg">Choose the plan that fits your program size. Upgrade or cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-gray-900 rounded-2xl p-8 border ${
                plan.popular ? "border-red-600 shadow-xl shadow-red-600/10" : "border-gray-800"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h2 className="text-white font-bold text-xl mb-2">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-extrabold text-white">${plan.price}</span>
                <span className="text-gray-400 text-lg">/month</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                {plan.affiliates === -1 ? "Unlimited" : plan.affiliates} affiliates ·{" "}
                {plan.programs === -1 ? "Unlimited" : plan.programs} program{plan.programs !== 1 ? "s" : ""}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`block text-center py-3.5 rounded-xl font-semibold transition-colors ${
                  plan.popular
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Pricing FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Is there a free trial?", a: "Yes, all plans include a 14-day free trial. No credit card required to start." },
              { q: "Can I change plans?", a: "Absolutely. You can upgrade or downgrade at any time. Changes take effect on your next billing cycle." },
              { q: "What payment methods do you accept?", a: "We accept all major credit cards via Stripe. No PayPal at this time." },
              { q: "Are affiliates charged?", a: "Never. Affiliates join and use AffiliateHide completely free. Only companies pay a subscription." },
            ].map((item) => (
              <details key={item.q} className="bg-gray-900 border border-gray-800 rounded-xl group">
                <summary className="px-6 py-4 cursor-pointer text-white font-medium flex items-center justify-between">
                  {item.q}
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-gray-400 text-sm">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
