"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"

const navItems = [
  { label: "Overview", href: "/dashboard/company", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: "Programs", href: "/dashboard/company/programs", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { label: "Affiliates", href: "/dashboard/company/affiliates", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { label: "Payouts", href: "/dashboard/company/payouts", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
]

export default function AffiliatesPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/programs?mine=1")
      .then((r) => r.json())
      .then(async (progs) => {
        const full = await Promise.all(
          (Array.isArray(progs) ? progs : []).map((p: any) =>
            fetch(`/api/programs/${p.id}`).then((r) => r.json())
          )
        )
        setPrograms(full)
        setLoading(false)
      })
  }, [])

  const allMemberships = programs.flatMap((p) =>
    (p.memberships ?? []).map((m: any) => ({ ...m, programName: p.name }))
  )

  return (
    <DashboardLayout navItems={navItems} title="Company Dashboard">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">All Affiliates</h1>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : allMemberships.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center text-gray-400">
            No affiliates yet. Share your program page to get applications.
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800">
                <tr className="text-gray-400 text-left">
                  <th className="px-6 py-3 font-medium">Affiliate</th>
                  <th className="px-6 py-3 font-medium">Program</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Clicks</th>
                  <th className="px-6 py-3 font-medium">Conversions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {allMemberships.map((m: any) => {
                  const clicks = (m.links ?? []).reduce((s: number, l: any) => s + (l._count?.clicks ?? 0), 0)
                  const conversions = (m.links ?? []).reduce((s: number, l: any) => s + (l._count?.conversions ?? 0), 0)
                  return (
                    <tr key={m.id} className="text-gray-300">
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{m.affiliate?.name ?? "—"}</p>
                        <p className="text-gray-500 text-xs">{m.affiliate?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{m.programName}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          m.status === "approved" ? "bg-green-500/10 text-green-400" :
                          m.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                          "bg-red-500/10 text-red-400"
                        }`}>{m.status}</span>
                      </td>
                      <td className="px-6 py-4">{clicks}</td>
                      <td className="px-6 py-4">{conversions}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
