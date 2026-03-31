'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface Profile {
  id: string
  name: string | null
  email: string
  vibe_summary: string | null
}

interface Match {
  id: string
  icebreaker_prompt: string | null
  profiles: Profile[]
}

export default function MatchesClient({ matches }: { matches: Match[] }) {
  const hasMatches = matches.length > 0

  return (
    <main className="app-container flex flex-col min-h-dvh py-12">
      <p className="text-coral font-semibold text-lg mb-2">stumble</p>
      <h1 className="text-3xl font-bold text-near-black mb-1">your matches</h1>
      <p className="text-gray-400 text-sm mb-8">this week&apos;s people</p>

      {!hasMatches ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col justify-center text-center gap-3"
        >
          <p className="text-4xl">🌀</p>
          <p className="text-near-black font-semibold text-lg">
            your first matches drop monday
          </p>
          <p className="text-gray-400 text-sm">we&apos;re finding your people.</p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-gray-200 rounded-card p-5 bg-white"
            >
              {match.profiles.map(profile => (
                <div key={profile.id} className="mb-4 last:mb-0">
                  <p className="font-semibold text-near-black text-base">
                    {profile.name || profile.email.split('@')[0]}
                  </p>
                  {profile.vibe_summary && (
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                      {profile.vibe_summary}
                    </p>
                  )}
                </div>
              ))}

              {match.icebreaker_prompt && (
                <div className="bg-orange-50 rounded-xl px-4 py-3 mt-3 mb-4">
                  <p className="text-xs text-coral font-medium mb-1">icebreaker</p>
                  <p className="text-sm text-near-black">{match.icebreaker_prompt}</p>
                </div>
              )}

              <Link
                href={`/chat/${match.id}`}
                className="block w-full text-center bg-coral text-white font-semibold py-3 rounded-xl hover:bg-[#d44e33] active:scale-[0.98] transition-all duration-150 text-sm"
              >
                start the conversation
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  )
}
