"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/DashboardLayout"

const navItems = [
  { label: "Overview", href: "/dashboard/company", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: "Programs", href: "/dashboard/company/programs", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { label: "Affiliates", href: "/dashboard/company/affiliates", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { label: "Payouts", href: "/dashboard/company/payouts", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
]

export default function ProgramsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    fetch("/api/programs?mine=1")
      .then((r) => r.json())
      .then((d) => { setPrograms(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  return (
    <DashboardLayout navItems={navItems} title="Company Dashboard">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Your Programs</h1>
          <Link href="/dashboard/company/programs/new" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + New Program
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : programs.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
            <p className="text-gray-400 mb-4">No programs yet. Create your first affiliate program.</p>
            <Link href="/dashboard/company/programs/new" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-sm font-medium">Create Program</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {programs.map((p) => (
              <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{p.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-700 text-gray-400"}`}>
                      {p.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{p._count?.memberships ?? 0} affiliates · {p.baseRate}{p.rateType === "percent" ? "%" : "$"} commission · {p.cookieDays}d cookie</p>
                </div>
                <Link href={`/dashboard/company/programs/${p.id}`} className="text-red-400 hover:text-red-300 text-sm">Manage →</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
