"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

interface Program {
  id: string
  name: string
  slug: string
  description: string | null
  websiteUrl: string
  logoUrl: string | null
  baseRate: number
  rateType: string
  cookieDays: number
  company: { name: string }
}

export default function ProgramLandingClient({ program }: { program: Program }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState("")

  const isAffiliate = (session?.user as any)?.role === "affiliate"

  async function handleApply() {
    if (status === "unauthenticated" || !session) {
      router.push(`/signup?role=affiliate&programSlug=${program.slug}`)
      return
    }

    if (!isAffiliate) {
      router.push(`/signup?role=affiliate&programSlug=${program.slug}`)
      return
    }

    setApplying(true)
    setError("")
    const res = await fetch("/api/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programId: program.id }),
    })
    const data = await res.json()
    if (res.ok) {
      setApplied(true)
    } else {
      setError(data.error || "Failed to apply")
    }
    setApplying(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-red-600 font-bold text-xl">Affiliate</span>
            <span className="font-bold text-xl text-white">Hide</span>
          </Link>
          <div className="flex gap-3">
            {session ? (
              <Link
                href={isAffiliate ? "/dashboard/affiliate" : "/dashboard/company"}
                className="text-sm text-gray-400 hover:text-white"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-400 hover:text-white">Sign in</Link>
                <Link href="/signup" className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        {program.logoUrl && (
          <img
            src={program.logoUrl}
            alt={`${program.name} logo`}
            className="w-20 h-20 rounded-2xl object-contain mx-auto mb-6 bg-gray-800 p-2"
          />
        )}
        <p className="text-gray-400 text-sm mb-2">{program.company.name}</p>
        <h1 className="text-4xl font-bold text-white mb-4">{program.name}</h1>
        {program.description && (
          <p className="text-gray-300 text-lg leading-relaxed mb-8">{program.description}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            {
              label: "Commission",
              value: `${program.baseRate}${program.rateType === "percent" ? "%" : "$"}`,
              icon: "💰",
            },
            {
              label: "Cookie Duration",
              value: `${program.cookieDays} days`,
              icon: "🍪",
            },
            {
              label: "Program Type",
              value: program.rateType === "percent" ? "Revenue Share" : "Flat Rate",
              icon: "📊",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-2xl mb-2">{stat.icon}</p>
              <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
              <p className="text-white font-bold text-xl">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        {applied ? (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-2xl p-6">
            <p className="text-lg font-semibold mb-1">Application submitted! 🎉</p>
            <p className="text-sm text-green-300">
              The company will review your application. Check your{" "}
              <Link href="/dashboard/affiliate/programs" className="underline">
                dashboard
              </Link>{" "}
              for updates.
            </p>
          </div>
        ) : (
          <div>
            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}
            <button
              onClick={handleApply}
              disabled={applying}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-10 py-4 rounded-2xl text-lg font-bold transition-colors"
            >
              {applying ? "Applying..." : "Apply Now →"}
            </button>
            {!session && (
              <p className="text-gray-500 text-sm mt-3">
                You'll be asked to create a free affiliate account
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
