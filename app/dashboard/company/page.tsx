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

export default function CompanyDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    fetch("/api/programs?mine=1")
      .then((r) => r.json())
      .then((data) => { setPrograms(Array.isArray(data) ? data : []); setLoading(false) })
  }, [])

  const totalAffiliates = programs.reduce((sum, p) => sum + (p._count?.memberships ?? 0), 0)

  return (
    <DashboardLayout navItems={navItems} title="Company Dashboard">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {session?.user?.name ?? session?.user?.email}</h1>
            <p className="text-gray-400 mt-1">Here's your affiliate program overview</p>
          </div>
          <Link
            href="/dashboard/company/programs/new"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + New Program
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Programs", value: programs.length },
            { label: "Total Affiliates", value: totalAffiliates },
            { label: "Active Programs", value: programs.filter((p) => p.isActive).length },
            { label: "Pending Approvals", value: "—" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Programs list */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Your Programs</h2>
            <Link href="/dashboard/company/programs" className="text-red-400 text-sm hover:text-red-300">View all →</Link>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : programs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 mb-4">No programs yet</p>
              <Link href="/dashboard/company/programs/new" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">Create Your First Program</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {programs.slice(0, 5).map((program) => (
                <div key={program.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{program.name}</p>
                    <p className="text-gray-500 text-sm">{program._count?.memberships ?? 0} affiliates · {program.isActive ? "Active" : "Paused"}</p>
                  </div>
                  <Link href={`/dashboard/company/programs/${program.id}`} className="text-red-400 text-sm hover:text-red-300">Manage →</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
