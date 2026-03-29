"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/DashboardLayout"

const navItems = [
  { label: "Overview", href: "/dashboard/company", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: "Programs", href: "/dashboard/company/programs", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { label: "Affiliates", href: "/dashboard/company/affiliates", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { label: "Payouts", href: "/dashboard/company/payouts", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
]

const medals = ["🥇", "🥈", "🥉"]

export default function LeaderboardPage() {
  const params = useParams()
  const id = params.id as string
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [programName, setProgramName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`/api/programs/${id}/leaderboard`).then((r) => r.json()),
      fetch(`/api/programs/${id}`).then((r) => r.json()),
    ]).then(([lb, prog]) => {
      setLeaderboard(Array.isArray(lb) ? lb : [])
      setProgramName(prog?.name ?? "")
      setLoading(false)
    })
  }, [id])

  return (
    <DashboardLayout navItems={navItems} title="Company Dashboard">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href={`/dashboard/company/programs/${id}`} className="text-gray-400 text-sm hover:text-white">
            ← Back to Program
          </Link>
          <h1 className="text-2xl font-bold text-white mt-2">
            Leaderboard — {programName}
          </h1>
          <p className="text-gray-400 text-sm mt-1">Top 10 affiliates ranked by conversions</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading...</div>
        ) : leaderboard.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-400">
            No approved affiliates yet.
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800 bg-gray-950">
                <tr className="text-gray-400 text-left">
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">Affiliate</th>
                  <th className="px-6 py-4 font-medium text-right">Clicks</th>
                  <th className="px-6 py-4 font-medium text-right">Conversions</th>
                  <th className="px-6 py-4 font-medium text-right">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {leaderboard.map((entry) => (
                  <tr key={entry.affiliateId} className="text-gray-300 hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-lg">
                        {entry.rank <= 3 ? medals[entry.rank - 1] : `#${entry.rank}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{entry.affiliateName}</p>
                    </td>
                    <td className="px-6 py-4 text-right">{entry.totalClicks}</td>
                    <td className="px-6 py-4 text-right text-green-400 font-semibold">{entry.totalConversions}</td>
                    <td className="px-6 py-4 text-right text-white font-semibold">${entry.totalEarnings.toFixed(2)}</td>
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
