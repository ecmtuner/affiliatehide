"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"

const navItems = [
  { label: "Overview", href: "/dashboard/affiliate", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: "Programs", href: "/dashboard/affiliate/programs", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { label: "My Links", href: "/dashboard/affiliate/links", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
  { label: "Earnings", href: "/dashboard/affiliate/earnings", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
]

export default function EarningsPage() {
  const [payouts, setPayouts] = useState<any[]>([])
  const [paypalEmail, setPaypalEmail] = useState("")
  const [editingPaypal, setEditingPaypal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/payouts").then((r) => r.json()),
      fetch("/api/user").then((r) => r.json()),
    ]).then(([p, u]) => {
      setPayouts(Array.isArray(p) ? p : [])
      setPaypalEmail(u.paypalEmail ?? "")
      setLoading(false)
    })
  }, [])

  async function savePaypal() {
    setSaving(true)
    await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paypalEmail }),
    })
    setSaving(false)
    setEditingPaypal(false)
  }

  const total = payouts.reduce((s, p) => s + p.amount, 0)
  const pending = payouts.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0)
  const paid = payouts.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0)

  return (
    <DashboardLayout navItems={navItems} title="Affiliate Dashboard">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Earnings</h1>

        {/* PayPal */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">PayPal Email</h2>
            <button onClick={() => setEditingPaypal(!editingPaypal)} className="text-red-400 text-sm hover:text-red-300">
              {editingPaypal ? "Cancel" : "Edit"}
            </button>
          </div>
          {editingPaypal ? (
            <div className="flex gap-3">
              <input
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-600"
                placeholder="your@paypal.com"
              />
              <button
                onClick={savePaypal}
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">{paypalEmail || "Not set"}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Earned", value: `$${total.toFixed(2)}`, color: "text-white" },
            { label: "Pending", value: `$${pending.toFixed(2)}`, color: "text-yellow-400" },
            { label: "Paid Out", value: `$${paid.toFixed(2)}`, color: "text-green-400" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* History */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : payouts.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-400">
            No payouts yet. Start earning by promoting your affiliate links!
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-semibold">Payout History</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800">
                <tr className="text-gray-400 text-left">
                  <th className="px-6 py-3 font-medium">Program</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {payouts.map((p) => (
                  <tr key={p.id} className="text-gray-300">
                    <td className="px-6 py-4">{p.program?.name}</td>
                    <td className="px-6 py-4 text-white font-semibold">${p.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "paid" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
