import Link from "next/link"
import { Navbar } from "@/components/Navbar"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-400 mb-10">Last updated: March 2025</p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including name, email address, and payment information. We also automatically collect usage data including IP addresses, browser type, referring URLs, and pages visited.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your information to provide, maintain, and improve our services, process payments, send transactional communications, and comply with legal obligations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h2>
            <p>We do not sell or rent your personal information. We may share information with service providers who assist in our operations (Stripe for payments, database providers) under strict confidentiality agreements.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Cookie Tracking</h2>
            <p>AffiliateHide uses cookies to track affiliate referrals. When a user clicks an affiliate link, a cookie is set to attribute any subsequent conversions to the appropriate affiliate. These cookies contain only link identifiers and no personal information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. Click and conversion data is retained for 24 months. You may request deletion of your data by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Security</h2>
            <p>We implement industry-standard security measures including HTTPS encryption, hashed passwords, and regular security audits. No system is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Contact Us</h2>
            <p>For privacy-related questions, contact us at <a href="mailto:privacy@affiliatehide.com" className="text-red-400 hover:text-red-300">privacy@affiliatehide.com</a>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <Link href="/" className="text-red-400 hover:text-red-300 text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
