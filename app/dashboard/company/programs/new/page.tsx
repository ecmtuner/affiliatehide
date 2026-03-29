"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/DashboardLayout"

const navItems = [
  { label: "Overview", href: "/dashboard/company", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: "Programs", href: "/dashboard/company/programs", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { label: "Affiliates", href: "/dashboard/company/affiliates", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { label: "Payouts", href: "/dashboard/company/payouts", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
]

export default function NewProgramPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    description: "",
    websiteUrl: "",
    logoUrl: "",
    baseRate: "10",
    rateType: "percent",
    cookieDays: "30",
    autoApprove: false,
    payoutThreshold: "50",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function update(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || "Failed"); return }
    router.push(`/dashboard/company/programs/${data.id}`)
  }

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
  const labelClass = "block text-sm text-gray-400 mb-1.5"

  return (
    <DashboardLayout navItems={navItems} title="Company Dashboard">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/company/programs" className="text-gray-400 text-sm hover:text-white">← Back to Programs</Link>
          <h1 className="text-2xl font-bold text-white mt-2">Create New Program</h1>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-600/10 border border-red-600/20 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}

            <div>
              <label className={labelClass}>Program Name *</label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} required className={inputClass} placeholder="My Affiliate Program" />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} className={inputClass} placeholder="Describe your program..." />
            </div>

            <div>
              <label className={labelClass}>Website URL *</label>
              <input type="url" value={form.websiteUrl} onChange={(e) => update("websiteUrl", e.target.value)} required className={inputClass} placeholder="https://yoursite.com" />
            </div>

            <div>
              <label className={labelClass}>Logo URL</label>
              <input type="url" value={form.logoUrl} onChange={(e) => update("logoUrl", e.target.value)} className={inputClass} placeholder="https://yoursite.com/logo.png" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Commission Rate</label>
                <input type="number" value={form.baseRate} onChange={(e) => update("baseRate", e.target.value)} min="0" step="0.01" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Rate Type</label>
                <select value={form.rateType} onChange={(e) => update("rateType", e.target.value)} className={inputClass}>
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount ($)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Cookie Duration (days)</label>
                <select value={form.cookieDays} onChange={(e) => update("cookieDays", e.target.value)} className={inputClass}>
                  {[7, 14, 30, 60, 90].map((d) => (
                    <option key={d} value={d}>{d} days</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Payout Threshold ($)</label>
                <input type="number" value={form.payoutThreshold} onChange={(e) => update("payoutThreshold", e.target.value)} min="0" className={inputClass} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoApprove"
                checked={form.autoApprove}
                onChange={(e) => update("autoApprove", e.target.checked)}
                className="w-4 h-4 accent-red-600"
              />
              <label htmlFor="autoApprove" className="text-sm text-gray-300">Auto-approve affiliate applications</label>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
              {loading ? "Creating..." : "Create Program"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
