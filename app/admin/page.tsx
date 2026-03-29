"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/DashboardLayout"

const navItems = [
  { label: "Admin Panel", href: "/admin", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
]

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return }
    if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/")
    }
  }, [status, session, router])

  useEffect(() => {
    fetch("/api/admin")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <DashboardLayout navItems={navItems} title="Admin"><div className="text-gray-500 text-center py-16">Loading...</div></DashboardLayout>

  const companies = data?.users?.filter((u: any) => u.role === "company") ?? []
  const affiliates = data?.users?.filter((u: any) => u.role === "affiliate") ?? []

  return (
    <DashboardLayout navItems={navItems} title="Admin Panel">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Admin Panel</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Companies", value: companies.length },
            { label: "Affiliates", value: affiliates.length },
            { label: "Programs", value: data?.programs?.length ?? 0 },
            { label: "Platform Revenue", value: `$${(data?.totalRevenue ?? 0).toFixed(2)}` },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Users */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl mb-6">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-white font-semibold">All Users</h2>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800">
                <tr className="text-gray-400 text-left">
                  <th className="px-6 py-3 font-medium">Name/Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {(data?.users ?? []).map((u: any) => (
                  <tr key={u.id} className="text-gray-300">
                    <td className="px-6 py-4">
                      <p className="text-white">{u.name ?? "—"}</p>
                      <p className="text-gray-500 text-xs">{u.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        u.role === "company" ? "bg-blue-500/10 text-blue-400" :
                        u.role === "admin" ? "bg-red-500/10 text-red-400" :
                        "bg-gray-700 text-gray-400"
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{u.plan ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Programs */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-white font-semibold">All Programs</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {(data?.programs ?? []).map((p: any) => (
              <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{p.name}</p>
                  <p className="text-gray-500 text-xs">by {p.company?.name} · {p._count?.memberships ?? 0} affiliates</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-700 text-gray-400"}`}>
                  {p.isActive ? "Active" : "Paused"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
