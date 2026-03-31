'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const QUESTIONS = [
  {
    id: 1,
    text: "It's Friday night — what are you actually doing?",
    type: 'choice',
    options: [
      'at a house party',
      'watching something with a few people',
      'working on something',
      'honestly could go either way',
    ],
  },
  {
    id: 2,
    text: 'Your idea of a perfect day involves...',
    type: 'choice',
    options: [
      'exploring somewhere new',
      'a cosy day in',
      'being around lots of people',
      'deep conversations with one person',
    ],
  },
  {
    id: 3,
    text: "You'd rather...",
    type: 'choice',
    options: ['have lots of acquaintances', 'have a small tight circle'],
  },
  {
    id: 4,
    text: "When something's bothering you, you...",
    type: 'choice',
    options: [
      'want to talk it out',
      'need time to process alone',
      'distract yourself',
      'depends on the situation',
    ],
  },
  {
    id: 5,
    text: "What's your relationship with plans?",
    type: 'choice',
    options: [
      'love having a schedule',
      'prefer going with the flow',
      'hate both, just vibe',
    ],
  },
  {
    id: 6,
    text: 'Pick the one that fits you most:',
    type: 'choice',
    options: [
      "I remember everyone's birthday",
      "I'm the one who starts the group chat",
      'I show up when it matters',
      "I'm better one-on-one",
    ],
  },
  {
    id: 7,
    text: "What are people usually surprised to find out about you?",
    type: 'text',
    placeholder: 'type something...',
    maxLength: 150,
  },
]

export default function QuizPage() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [textInput, setTextInput] = useState('')
  const [direction, setDirection] = useState(1)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const question = QUESTIONS[current]
  const progress = ((current) / QUESTIONS.length) * 100

  async function saveAnswer(questionId: number, answer: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('quiz_answers').upsert({
      user_id: user.id,
      question_id: questionId,
      answer,
    }, { onConflict: 'user_id,question_id' })
  }

  async function handleChoice(option: string) {
    const newAnswers = { ...answers, [question.id]: option }
    setAnswers(newAnswers)
    await saveAnswer(question.id, option)

    if (current < QUESTIONS.length - 1) {
      setDirection(1)
      setCurrent(c => c + 1)
    } else {
      await finish(newAnswers)
    }
  }

  async function handleTextSubmit() {
    if (!textInput.trim()) return
    setSaving(true)
    const newAnswers = { ...answers, [question.id]: textInput.trim() }
    setAnswers(newAnswers)
    await saveAnswer(question.id, textInput.trim())
    await finish(newAnswers)
  }

  async function finish(_finalAnswers: Record<number, string>) {
    setSaving(true)
    // Mark quiz complete on user profile
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ name: user.email?.split('@')[0] }).eq('id', user.id)
    }
    router.push('/vibe')
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  }

  return (
    <main className="app-container flex flex-col min-h-dvh py-10">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100 rounded-full mb-10">
        <motion.div
          className="h-1 bg-coral rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex flex-col gap-6"
          >
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
              {current + 1} / {QUESTIONS.length}
            </p>
            <h2 className="text-2xl font-bold text-near-black leading-snug">
              {question.text}
            </h2>

            {question.type === 'choice' && question.options && (
              <div className="flex flex-col gap-3">
                {question.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleChoice(opt)}
                    className="text-left border border-gray-200 rounded-2xl px-5 py-4 text-base text-near-black hover:border-coral hover:bg-orange-50 active:scale-[0.98] transition-all duration-150"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'text' && (
              <div className="flex flex-col gap-4">
                <textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder={question.placeholder}
                  maxLength={question.maxLength}
                  rows={3}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-4 text-base outline-none focus:border-coral transition-colors resize-none placeholder:text-gray-300"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{textInput.length}/{question.maxLength}</span>
                  <button
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim() || saving}
                    className="bg-coral text-white font-semibold px-6 py-3 rounded-2xl hover:bg-[#d44e33] active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
                  >
                    {saving ? 'saving...' : 'done'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
