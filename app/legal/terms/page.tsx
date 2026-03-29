import Link from "next/link"
import { Navbar } from "@/components/Navbar"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-400 mb-10">Last updated: March 2025</p>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using AffiliateHide ("Service"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>AffiliateHide is a SaaS platform enabling companies to create and manage affiliate marketing programs. Affiliates use the platform to discover programs, generate tracking links, and track earnings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Account Responsibilities</h2>
            <p>You are responsible for maintaining the security of your account credentials. You must not use the Service to engage in fraudulent click activity, spam, or any illegal activities. We reserve the right to terminate accounts in violation of these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Subscription and Payments</h2>
            <p>Company subscriptions are billed monthly. All fees are non-refundable except as required by law. We reserve the right to change pricing with 30 days notice. Failure to pay may result in account suspension.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Affiliate Commissions</h2>
            <p>Commission rates, payout thresholds, and payment timelines are set by individual companies. AffiliateHide is not responsible for commission disputes between companies and affiliates. We facilitate the tracking; payment is the company's responsibility.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Prohibited Use</h2>
            <p>You may not use AffiliateHide to promote illegal products, adult content, gambling, or services that violate applicable laws. Click fraud, incentivized clicks without proper disclosure, and cookie stuffing are strictly prohibited and will result in immediate account termination.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p>AffiliateHide shall not be liable for any indirect, incidental, or consequential damages. Our maximum liability is limited to the amounts paid by you in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Changes to Terms</h2>
            <p>We may modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms. We will notify users of material changes via email.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
            <p>Questions about these terms? Contact us at <a href="mailto:legal@affiliatehide.com" className="text-red-400 hover:text-red-300">legal@affiliatehide.com</a>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <Link href="/" className="text-red-400 hover:text-red-300 text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
