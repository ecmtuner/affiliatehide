"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"

const navItems = [
  { label: "Overview", href: "/dashboard/affiliate", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: "Programs", href: "/dashboard/affiliate/programs", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { label: "My Links", href: "/dashboard/affiliate/links", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
  { label: "Earnings", href: "/dashboard/affiliate/earnings", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
]

export default function AffiliateProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [memberships, setMemberships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/programs").then((r) => r.json()),
      fetch("/api/memberships").then((r) => r.json()),
    ]).then(([progs, mems]) => {
      setPrograms(Array.isArray(progs) ? progs : [])
      setMemberships(Array.isArray(mems) ? mems : [])
      setLoading(false)
    })
  }, [])

  async function apply(programId: string) {
    setApplying(programId)
    const res = await fetch("/api/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programId }),
    })
    if (res.ok) {
      const newMem = await res.json()
      setMemberships((prev) => [...prev, newMem])
    }
    setApplying(null)
  }

  function getMembershipStatus(programId: string) {
    return memberships.find((m) => m.programId === programId)?.status ?? null
  }

  return (
    <DashboardLayout navItems={navItems} title="Affiliate Dashboard">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Browse Programs</h1>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : programs.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center text-gray-400">No programs available yet.</div>
        ) : (
          <div className="space-y-4">
            {programs.map((p) => {
              const status = getMembershipStatus(p.id)
              return (
                <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold text-lg mb-1">{p.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{p.description ?? "No description"}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>Commission: <span className="text-white">{p.baseRate}{p.rateType === "percent" ? "%" : "$"}</span></span>
                        <span>Cookie: <span className="text-white">{p.cookieDays}d</span></span>
                        <span>By: <span className="text-white">{p.company?.name ?? "Unknown"}</span></span>
                        <span>{p.autoApprove ? "✓ Auto-approve" : "Manual review"}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {status === null ? (
                        <button
                          onClick={() => apply(p.id)}
                          disabled={applying === p.id}
                          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          {applying === p.id ? "Applying..." : "Apply"}
                        </button>
                      ) : (
                        <span className={`text-xs px-3 py-1.5 rounded-lg border ${
                          status === "approved" ? "bg-green-500/10 border-green-600/30 text-green-400" :
                          status === "pending" ? "bg-yellow-500/10 border-yellow-600/30 text-yellow-400" :
                          "bg-red-500/10 border-red-600/30 text-red-400"
                        }`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
