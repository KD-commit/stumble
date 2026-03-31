'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function VibePage() {
  const [vibe, setVibe] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Check if vibe already exists
      const { data: profile } = await supabase
        .from('users')
        .select('vibe_summary, name, email')
        .eq('id', user.id)
        .single()

      const displayName = profile?.name || user.email?.split('@')[0] || 'you'
      setName(displayName)

      if (profile?.vibe_summary) {
        setVibe(profile.vibe_summary)
        setLoading(false)
        return
      }

      // Generate vibe
      const res = await fetch('/api/vibe', { method: 'POST' })
      const data = await res.json()
      setVibe(data.vibe)
      setLoading(false)
    }
    load()
  }, [])

  async function copyVibe() {
    if (!vibe) return
    await navigator.clipboard.writeText(`my stumble vibe:\n\n${vibe}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="app-container flex flex-col min-h-dvh py-12">
      <p className="text-coral font-semibold text-lg mb-10">stumble</p>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col justify-center gap-4"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-coral rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
          <p className="text-gray-500">figuring out your vibe...</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-near-black mb-1">your vibe</h1>
            <p className="text-gray-400 text-sm">here&apos;s how we see you, {name}</p>
          </div>

          {/* Vibe card */}
          <div className="border border-gray-200 rounded-card p-6 bg-white">
            <p className="text-sm font-semibold text-coral mb-3">{name}</p>
            <p className="text-near-black leading-relaxed text-base">{vibe}</p>
          </div>

          {/* Share button */}
          <button
            onClick={copyVibe}
            className="w-full border border-gray-200 rounded-2xl py-4 text-base font-medium text-near-black hover:border-coral hover:bg-orange-50 active:scale-[0.98] transition-all duration-150"
          >
            {copied ? '✓ copied to clipboard' : 'share your vibe'}
          </button>

          {/* Matches info */}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">your matches drop every monday.</p>
          </div>

          <Link
            href="/matches"
            className="w-full text-center bg-coral text-white font-semibold py-4 rounded-2xl hover:bg-[#d44e33] active:scale-[0.98] transition-all duration-150"
          >
            see your matches
          </Link>
        </motion.div>
      )}
    </main>
  )
}
