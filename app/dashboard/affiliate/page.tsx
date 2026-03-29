"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/DashboardLayout"

const navItems = [
  { label: "Overview", href: "/dashboard/affiliate", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: "Programs", href: "/dashboard/affiliate/programs", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { label: "My Links", href: "/dashboard/affiliate/links", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
  { label: "Earnings", href: "/dashboard/affiliate/earnings", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
]

export default function AffiliateDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [memberships, setMemberships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    fetch("/api/memberships")
      .then((r) => r.json())
      .then((d) => { setMemberships(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  const totalClicks = memberships.flatMap((m) => m.links ?? []).reduce((s: number, l: any) => s + (l._count?.clicks ?? 0), 0)
  const totalConversions = memberships.flatMap((m) => m.links ?? []).reduce((s: number, l: any) => s + (l._count?.conversions ?? 0), 0)
  const approved = memberships.filter((m) => m.status === "approved").length

  return (
    <DashboardLayout navItems={navItems} title="Affiliate Dashboard">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back, {session?.user?.name ?? session?.user?.email}</h1>
          <p className="text-gray-400 mt-1">Your affiliate performance overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Programs", value: approved },
            { label: "Total Clicks", value: totalClicks },
            { label: "Conversions", value: totalConversions },
            { label: "Conversion Rate", value: totalClicks > 0 ? `${((totalConversions / totalClicks) * 100).toFixed(1)}%` : "—" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: "Browse Programs", desc: "Find programs to join and start earning commissions.", href: "/dashboard/affiliate/programs", label: "Browse Programs" },
            { title: "My Links", desc: "View your tracking links and generate deep links.", href: "/dashboard/affiliate/links", label: "View Links" },
          ].map((card) => (
            <div key={card.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{card.desc}</p>
              <Link href={card.href} className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition-colors">
                {card.label} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
