'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-dvh overflow-hidden relative flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #fff8f6 0%, #fff 40%, #f5f0ff 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #E8593C 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #E8593C 0%, transparent 60%)' }} />
      </div>

      {/* Floating vibe cards — only on very wide screens */}
      <div className="hidden xl:block absolute inset-0 pointer-events-none">
        {/* Left card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute w-56"
          style={{ left: '4%', top: '20%', transform: 'rotate(-2deg)' }}
        >
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-coral flex items-center justify-center text-white text-xs font-bold shrink-0">m</div>
              <div><p className="text-xs font-semibold text-[#1A1A1A]">maya</p><p className="text-[10px] text-[#ABABAB]">university of toronto</p></div>
            </div>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">You turn a 2am library session into an actual good time. Equal parts ambitious and chaotic.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute w-52"
          style={{ left: '6%', bottom: '22%', transform: 'rotate(1.5deg)' }}
        >
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center text-white text-xs font-bold shrink-0">j</div>
              <div><p className="text-xs font-semibold text-[#1A1A1A]">james</p><p className="text-[10px] text-[#ABABAB]">mcgill university</p></div>
            </div>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">You show up quietly and leave loudly. People are always surprised by how much you notice.</p>
          </div>
        </motion.div>

        {/* Right card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute w-56"
          style={{ right: '4%', top: '30%', transform: 'rotate(1deg)' }}
        >
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold shrink-0">p</div>
              <div><p className="text-xs font-semibold text-[#1A1A1A]">priya</p><p className="text-[10px] text-[#ABABAB]">ubc</p></div>
            </div>
            <p className="text-xs text-[#4A4A4A] leading-relaxed">Deep-conversation-on-a-tuesday-night energy. Somehow always has the best recommendations.</p>
          </div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 bg-coral rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base leading-none">s</span>
            </div>
            <span className="text-coral font-semibold text-lg tracking-tight">stumble</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            <h1 className="text-6xl sm:text-7xl font-bold leading-[1.0] tracking-tight text-[#1A1A1A]">
              stumble<br />
              <span className="relative inline-block">
                upon
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-1 left-0 right-0 h-3 bg-coral opacity-20 rounded-sm origin-left"
                />
              </span>{' '}
              <span className="text-coral">your</span><br />people.
            </h1>

            <p className="text-xl text-[#6B6B6B] leading-relaxed max-w-sm">
              meet the 3 people on your campus who actually get you.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-coral text-white font-semibold text-base px-8 py-4 rounded-2xl hover:bg-[#d44e33] active:scale-[0.97] transition-all duration-150 shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              get started
              <span className="text-orange-200 text-lg">→</span>
            </Link>

            {/* Trust badges */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm text-[#ABABAB]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                .edu &amp; .ca only
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#ABABAB]">
                <span className="w-1.5 h-1.5 rounded-full bg-coral inline-block" />
                new matches every monday
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#ABABAB]">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                ai-powered matching
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
