"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/DashboardLayout"

const navItems = [
  { label: "Overview", href: "/dashboard/company", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: "Programs", href: "/dashboard/company/programs", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { label: "Affiliates", href: "/dashboard/company/affiliates", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { label: "Payouts", href: "/dashboard/company/payouts", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
]

export default function ProgramDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [program, setProgram] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/programs/${id}`)
      .then((r) => r.json())
      .then((d) => { setProgram(d); setLoading(false) })
  }, [id])

  async function updateMembership(memberId: string, status: string, customRate?: string) {
    setUpdating(memberId)
    const body: any = { status }
    if (customRate !== undefined) body.customRate = customRate
    const res = await fetch(`/api/programs/${id}/affiliates/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const updated = await res.json()
      setProgram((prev: any) => ({
        ...prev,
        memberships: prev.memberships.map((m: any) => m.id === memberId ? { ...m, ...updated } : m),
      }))
    }
    setUpdating(null)
  }

  if (loading) return <DashboardLayout navItems={navItems} title="Company Dashboard"><div className="text-gray-500 text-center py-16">Loading...</div></DashboardLayout>
  if (!program) return <DashboardLayout navItems={navItems} title="Company Dashboard"><div className="text-red-400 text-center py-16">Program not found</div></DashboardLayout>

  const pending = program.memberships.filter((m: any) => m.status === "pending")
  const approved = program.memberships.filter((m: any) => m.status === "approved")

  return (
    <DashboardLayout navItems={navItems} title="Company Dashboard">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/company/programs" className="text-gray-400 text-sm hover:text-white">← Back to Programs</Link>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-2xl font-bold text-white">{program.name}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full ${program.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-700 text-gray-400"}`}>
              {program.isActive ? "Active" : "Paused"}
            </span>
          </div>
        </div>

        {/* Program info */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Base Commission", value: `${program.baseRate}${program.rateType === "percent" ? "%" : "$"}` },
            { label: "Cookie Duration", value: `${program.cookieDays} days` },
            { label: "Conversion Token", value: program.conversionToken.slice(0, 12) + "..." },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-1">{s.label}</p>
              <p className="text-white font-semibold text-sm font-mono">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tracking URLs */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-3">Integration</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-400 text-xs mb-1">Postback URL (server-side conversion tracking)</p>
              <code className="bg-gray-800 text-green-400 text-xs px-3 py-2 rounded-lg block break-all">
                {typeof window !== "undefined" ? window.location.origin : ""}/api/postback?token={program.conversionToken}&amount=AMOUNT
              </code>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Pixel URL (add to thank-you page)</p>
              <code className="bg-gray-800 text-green-400 text-xs px-3 py-2 rounded-lg block break-all">
                &lt;img src="{typeof window !== "undefined" ? window.location.origin : ""}/api/pixel/CODE.gif" width="1" height="1" /&gt;
              </code>
            </div>
          </div>
        </div>

        {/* Pending applications */}
        {pending.length > 0 && (
          <div className="bg-gray-900 border border-yellow-600/20 rounded-xl mb-6">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="font-semibold text-white">Pending Applications <span className="text-yellow-400 text-sm">({pending.length})</span></h2>
            </div>
            <div className="divide-y divide-gray-800">
              {pending.map((m: any) => (
                <div key={m.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{m.affiliate.name ?? m.affiliate.email}</p>
                    <p className="text-gray-500 text-xs">{m.affiliate.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateMembership(m.id, "approved")}
                      disabled={updating === m.id}
                      className="bg-green-600/10 border border-green-600/30 text-green-400 hover:bg-green-600/20 px-3 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateMembership(m.id, "rejected")}
                      disabled={updating === m.id}
                      className="bg-red-600/10 border border-red-600/30 text-red-400 hover:bg-red-600/20 px-3 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved affiliates */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Active Affiliates <span className="text-gray-400 text-sm">({approved.length})</span></h2>
          </div>
          {approved.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No approved affiliates yet</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {approved.map((m: any) => {
                const totalClicks = m.links.reduce((s: number, l: any) => s + l._count.clicks, 0)
                const totalConversions = m.links.reduce((s: number, l: any) => s + l._count.conversions, 0)
                return (
                  <div key={m.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{m.affiliate.name ?? m.affiliate.email}</p>
                      <p className="text-gray-500 text-xs">{m.affiliate.email} · PayPal: {m.affiliate.paypalEmail ?? "not set"}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white text-sm">{totalClicks} clicks · {totalConversions} conversions</p>
                      <p className="text-gray-500 text-xs">Rate: {m.customRate ?? program.baseRate}{program.rateType === "percent" ? "%" : "$"}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
