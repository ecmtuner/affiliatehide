"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/DashboardLayout"

const navItems = [
  { label: "Overview", href: "/dashboard/affiliate", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { label: "Programs", href: "/dashboard/affiliate/programs", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { label: "My Links", href: "/dashboard/affiliate/links", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
  { label: "Earnings", href: "/dashboard/affiliate/earnings", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
]

export default function LinksPage() {
  const [memberships, setMemberships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deepLinkUrl, setDeepLinkUrl] = useState("")
  const [selectedMembershipId, setSelectedMembershipId] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/memberships")
      .then((r) => r.json())
      .then((d) => {
        const approved = (Array.isArray(d) ? d : []).filter((m: any) => m.status === "approved")
        setMemberships(approved)
        if (approved.length > 0) setSelectedMembershipId(approved[0].id)
        setLoading(false)
      })
  }, [])

  async function generateDeepLink() {
    if (!selectedMembershipId || !deepLinkUrl) return
    setGenerating(true)
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ membershipId: selectedMembershipId, destinationUrl: deepLinkUrl }),
    })
    const data = await res.json()
    if (res.ok) {
      setGeneratedLink(`${window.location.origin}/r/${data.code}`)
      setMemberships((prev) =>
        prev.map((m) =>
          m.id === selectedMembershipId
            ? { ...m, links: [...(m.links ?? []), { ...data, _count: { clicks: 0, conversions: 0 } }] }
            : m
        )
      )
    }
    setGenerating(false)
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  const origin = typeof window !== "undefined" ? window.location.origin : ""

  return (
    <DashboardLayout navItems={navItems} title="Affiliate Dashboard">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">My Links</h1>

        {/* Deep link generator */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Deep Link Generator</h2>
          <p className="text-gray-400 text-sm mb-4">Paste any URL to create a cloaked affiliate link that tracks clicks.</p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Select Program</label>
              <select
                value={selectedMembershipId}
                onChange={(e) => setSelectedMembershipId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
              >
                {memberships.map((m) => (
                  <option key={m.id} value={m.id}>{m.program?.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Destination URL</label>
              <input
                type="url"
                value={deepLinkUrl}
                onChange={(e) => setDeepLinkUrl(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                placeholder="https://example.com/product/123"
              />
            </div>
            <button
              onClick={generateDeepLink}
              disabled={generating || !deepLinkUrl || !selectedMembershipId}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              {generating ? "Generating..." : "Generate Link"}
            </button>
          </div>

          {generatedLink && (
            <div className="mt-4 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <code className="text-green-400 text-sm truncate">{generatedLink}</code>
              <button
                onClick={() => copy(generatedLink)}
                className="text-xs text-gray-400 hover:text-white flex-shrink-0 transition-colors"
              >
                {copied === generatedLink ? "✓ Copied" : "Copy"}
              </button>
            </div>
          )}
        </div>

        {/* All links */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : memberships.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center text-gray-400">
            Get approved for a program to see your tracking links.
          </div>
        ) : (
          <div className="space-y-4">
            {memberships.map((m) => (
              <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                  <h3 className="text-white font-semibold">{m.program?.name}</h3>
                </div>
                {(m.links ?? []).length === 0 ? (
                  <div className="px-6 py-4 text-gray-500 text-sm">No links yet</div>
                ) : (
                  <div className="divide-y divide-gray-800">
                    {m.links.map((link: any) => (
                      <div key={link.id} className="px-6 py-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <code className="text-red-400 text-sm">{origin}/r/{link.code}</code>
                          <button
                            onClick={() => copy(`${origin}/r/${link.code}`)}
                            className="text-xs text-gray-400 hover:text-white transition-colors flex-shrink-0"
                          >
                            {copied === `${origin}/r/${link.code}` ? "✓ Copied" : "Copy"}
                          </button>
                        </div>
                        <p className="text-gray-500 text-xs truncate">{link.destinationUrl}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-400">
                          <span>{link._count?.clicks ?? 0} clicks</span>
                          <span>{link._count?.conversions ?? 0} conversions</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
