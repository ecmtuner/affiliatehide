import Link from "next/link"
import { Navbar } from "@/components/Navbar"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-400 text-sm px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Real-time tracking · Zero setup fee
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            The Affiliate Platform
            <br />
            <span className="text-red-600">Built for Growth</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Create your affiliate program in minutes. Track every click, conversion, and payout in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
            >
              Start 7-Day Free Trial
            </Link>
            <Link
              href="/pricing"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
            >
              View Pricing
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-4">No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-gray-800">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10M+", label: "Links tracked" },
            { value: "$2.4M+", label: "Commissions paid" },
            { value: "99.9%", label: "Uptime" },
            { value: "500+", label: "Companies" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything you need to scale</h2>
            <p className="text-gray-400 text-lg">A complete toolkit for managing affiliate programs at any scale</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🔗",
                title: "Link Cloaking",
                desc: "Hide your affiliate URLs with clean branded short links. Protect your commissions from ad blockers.",
              },
              {
                icon: "📊",
                title: "Real-time Tracking",
                desc: "Every click and conversion tracked instantly. Know your ROI across all affiliate partners.",
              },
              {
                icon: "💰",
                title: "Flexible Commissions",
                desc: "Set percentage or flat-rate commissions. Override rates per affiliate for VIP partners.",
              },
              {
                icon: "💸",
                title: "Easy Payouts",
                desc: "Export CSV payout reports. Mark as paid with one click. PayPal integration for affiliates.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-red-600/40 transition-colors">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Launch in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Your Program", desc: "Sign up as a company, define your commission structure, and set your program live in minutes." },
              { step: "02", title: "Recruit Affiliates", desc: "Share your program page. Affiliates apply, you approve, they get unique tracking links automatically." },
              { step: "03", title: "Track & Pay", desc: "Monitor every click and conversion in real time. Export reports and pay out affiliates effortlessly." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-red-600/10 border border-red-600/30 rounded-full flex items-center justify-center text-red-400 font-bold text-lg mb-4">
                  {s.step}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Starter",
                price: "$29",
                period: "/mo",
                affiliates: "25 affiliates",
                programs: "1 program",
                features: ["Real-time tracking", "Link cloaking", "CSV exports", "Email support"],
                popular: false,
              },
              {
                name: "Growth",
                price: "$79",
                period: "/mo",
                affiliates: "250 affiliates",
                programs: "5 programs",
                features: ["Everything in Starter", "Custom commission rates", "Pixel tracking", "Priority support"],
                popular: true,
              },
              {
                name: "Pro",
                price: "$199",
                period: "/mo",
                affiliates: "Unlimited affiliates",
                programs: "Unlimited programs",
                features: ["Everything in Growth", "API access", "White-label", "Dedicated support"],
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-gray-900 rounded-xl p-8 border ${
                  plan.popular ? "border-red-600 shadow-lg shadow-red-600/10" : "border-gray-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">{plan.affiliates} · {plan.programs}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-lg font-semibold text-sm transition-colors ${
                    plan.popular
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "border border-gray-700 hover:border-gray-500 text-gray-300"
                  }`}
                >
                  Start 7-Day Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Loved by affiliate marketers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah M.",
                role: "SaaS Founder",
                text: "AffiliateHide helped us launch our affiliate program in one afternoon. The tracking is spot-on and our affiliates love the clean dashboard.",
              },
              {
                name: "James K.",
                role: "E-commerce CEO",
                text: "We went from 0 to 50 active affiliates in two weeks. The approval workflow and custom commission rates are exactly what we needed.",
              },
              {
                name: "Lisa R.",
                role: "Digital Marketer",
                text: "As an affiliate, getting my unique links and tracking my earnings is seamless. The deep link generator saves me hours every week.",
              },
            ].map((t) => (
              <div key={t.name} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex text-yellow-400 mb-4">{"★★★★★"}</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "How does link cloaking work?",
                a: "Your affiliates get a short /r/[code] link. When clicked, we log the visit, set a tracking cookie, and instantly redirect to the destination. The original URL stays hidden.",
              },
              {
                q: "Can I set different commission rates per affiliate?",
                a: "Yes. You can set a base rate for your program and override it individually for any affiliate — perfect for rewarding top performers.",
              },
              {
                q: "How are conversions tracked?",
                a: "We support postback URLs and pixel tracking. Drop our 1x1 pixel on your thank-you page or fire our postback from your server after a purchase.",
              },
              {
                q: "How do affiliates get paid?",
                a: "Affiliates add their PayPal email. You export a CSV payout report and pay via PayPal Mass Pay or any method you prefer. Then mark payouts as paid in the dashboard.",
              },
              {
                q: "Is there a free trial?",
                a: "All plans start with a 7-day free trial. No credit card required.",
              },
            ].map((item) => (
              <details key={item.q} className="bg-gray-900 border border-gray-800 rounded-xl group">
                <summary className="px-6 py-4 cursor-pointer text-white font-medium flex items-center justify-between">
                  {item.q}
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 border-y border-red-600/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to launch your affiliate program?</h2>
          <p className="text-gray-400 mb-8">Join hundreds of companies already growing with AffiliateHide.</p>
          <Link
            href="/signup"
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors inline-block"
          >
            Start for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-1 mb-3">
                <span className="text-red-600 font-bold text-lg">Affiliate</span>
                <span className="font-bold text-lg text-white">Hide</span>
              </div>
              <p className="text-gray-500 text-sm">The affiliate platform built for growth.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Support</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="mailto:support@affiliatehide.com" className="hover:text-white transition-colors">support@affiliatehide.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} AffiliateHide. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
