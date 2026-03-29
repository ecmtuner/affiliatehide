"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<"company" | "affiliate">("affiliate")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Pre-fill role from query param and track programSlug for post-signup redirect
  const programSlug = searchParams.get("programSlug")
  const refUserId = searchParams.get("ref")

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam === "company" || roleParam === "affiliate") {
      setRole(roleParam)
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, referredBy: refUserId }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Registration failed")
      setLoading(false)
      return
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (signInRes?.error) {
      setError("Account created but login failed. Please log in manually.")
      setLoading(false)
      return
    }

    if (role === "affiliate" && programSlug) {
      // Apply to the program after signup
      const prog = await fetch("/api/programs/public/" + programSlug).then((r) => r.json()).catch(() => null)
      if (prog?.id) {
        await fetch("/api/memberships", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ programId: prog.id }),
        }).catch(() => {})
      }
      router.push("/dashboard/affiliate/programs")
    } else {
      router.push(role === "company" ? "/dashboard/company" : "/dashboard/affiliate")
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1">
            <span className="text-red-600 font-bold text-2xl">Affiliate</span>
            <span className="font-bold text-2xl text-white">Hide</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">Create your account</h1>
          <p className="text-gray-400 mt-1 text-sm">Start tracking affiliates in minutes</p>
          {programSlug && (
            <p className="text-green-400 text-sm mt-2">
              You're signing up to join the <strong>{programSlug}</strong> affiliate program
            </p>
          )}
          {refUserId && (
            <p className="text-blue-400 text-sm mt-2">
              You were referred by a friend — welcome! 🎉
            </p>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["company", "affiliate"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`py-3 px-4 rounded-xl text-sm font-medium border transition-colors ${
                  role === r
                    ? "bg-red-600/10 border-red-600 text-red-400"
                    : "border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {r === "company" ? "🏢 Company" : "🔗 Affiliate"}
              </button>
            ))}
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard/affiliate" })}
            className="w-full flex items-center justify-center gap-3 border border-gray-700 hover:border-gray-500 text-white py-3 rounded-xl text-sm font-medium transition-colors mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-gray-500 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-600/10 border border-red-600/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">
                {role === "company" ? "Company Name" : "Full Name"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                placeholder={role === "company" ? "Acme Corp" : "John Doe"}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                placeholder="Min 8 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-red-400 hover:text-red-300 transition-colors">
              Sign in
            </Link>
          </p>
          <p className="text-center text-gray-600 text-xs mt-3">
            By signing up, you agree to our{" "}
            <Link href="/legal/terms" className="underline">Terms</Link> and{" "}
            <Link href="/legal/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
