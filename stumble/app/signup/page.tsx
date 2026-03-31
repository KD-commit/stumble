'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const isEdu = (e: string) => {
    const lower = e.trim().toLowerCase()
    const domain = lower.split('@')[1] || ''
    return (
      domain.endsWith('.edu') ||
      domain.endsWith('.ac.uk') ||
      domain.endsWith('.ac.nz') ||
      domain.endsWith('.ac.za') ||
      domain.endsWith('.edu.au') ||
      domain.endsWith('.ca') ||
      domain.includes('.edu.')
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!isEdu(email)) {
      setError('please use your university email (.edu or .ca)')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      setSent(true)
    }
  }

  return (
    <main className="min-h-dvh bg-[#FAFAF8] flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-8"
            >
              {/* Back + logo */}
              <div className="flex items-center gap-3">
                <Link href="/" className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-[#ABABAB] hover:text-[#1A1A1A]">
                  ←
                </Link>
                <div className="w-7 h-7 bg-coral rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm leading-none">s</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A]">
                  what&apos;s your uni email?
                </h1>
                <p className="text-[#6B6B6B]">we accept .edu and university .ca addresses</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    placeholder="you@university.edu or .ca"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base outline-none focus:border-coral focus:ring-4 focus:ring-orange-50 transition-all placeholder:text-gray-300 shadow-sm"
                    autoComplete="email"
                    inputMode="email"
                  />
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-500 text-sm px-1"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-coral text-white font-semibold py-4 rounded-2xl hover:bg-[#d44e33] active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? 'sending...' : 'send magic link →'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6"
            >
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl">
                📬
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A]">
                  check your email
                </h1>
                <p className="text-[#6B6B6B] leading-relaxed">
                  we sent a magic link to{' '}
                  <span className="text-[#1A1A1A] font-medium">{email}</span>
                </p>
              </div>
              <p className="text-sm text-[#ABABAB]">
                didn&apos;t get it? check your spam folder.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
