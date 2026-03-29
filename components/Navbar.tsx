"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const role = (session?.user as any)?.role

  return (
    <nav className="border-b border-gray-800 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-red-600 font-bold text-xl">Affiliate</span>
            <span className="font-bold text-xl text-white">Hide</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">
              Pricing
            </Link>
            {!session ? (
              <>
                <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={role === "company" ? "/dashboard/company" : role === "admin" ? "/admin" : "/dashboard/affiliate"}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <button className="md:hidden text-gray-400" onClick={() => setOpen(!open)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link href="/pricing" className="text-gray-400 text-sm">Pricing</Link>
            {!session ? (
              <>
                <Link href="/login" className="text-gray-400 text-sm">Login</Link>
                <Link href="/signup" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm text-center">Get Started</Link>
              </>
            ) : (
              <>
                <Link href={role === "company" ? "/dashboard/company" : "/dashboard/affiliate"} className="text-gray-400 text-sm">Dashboard</Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-400 text-sm text-left">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
