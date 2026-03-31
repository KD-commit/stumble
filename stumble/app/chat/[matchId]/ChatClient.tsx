'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Message {
  id: string
  match_id: string
  sender_id: string
  content: string
  created_at: string
}

interface User {
  id: string
  name: string | null
  email: string
}

interface Props {
  matchId: string
  icebreakerPrompt: string | null
  initialMessages: Message[]
  currentUserId: string
  otherUsers: User[]
}

export default function ChatClient({ matchId, icebreakerPrompt, initialMessages, currentUserId, otherUsers }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const chatTitle = otherUsers.map(u => u.name || u.email.split('@')[0]).join(' & ')

  useEffect(() => {
    // Subscribe to realtime messages
    const channel = supabase
      .channel(`chat:${matchId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` },
        (payload) => {
          setMessages(prev => {
            // Avoid duplicates
            if (prev.find(m => m.id === payload.new.id)) return prev
            return [...prev, payload.new as Message]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [matchId, supabase])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending) return

    setSending(true)
    const content = input.trim()
    setInput('')

    await supabase.from('messages').insert({
      match_id: matchId,
      sender_id: currentUserId,
      content,
    })

    setSending(false)
  }

  function formatTime(ts: string) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <main className="app-container flex flex-col h-dvh">
      {/* Header */}
      <div className="flex items-center gap-3 py-4 border-b border-gray-100">
        <Link href="/matches" className="text-gray-400 hover:text-near-black transition-colors">
          ←
        </Link>
        <div>
          <p className="font-semibold text-near-black text-sm">{chatTitle}</p>
        </div>
      </div>

      {/* Icebreaker pinned */}
      {icebreakerPrompt && (
        <div className="bg-orange-50 border-b border-orange-100 px-4 py-3">
          <p className="text-xs text-coral font-medium mb-0.5">icebreaker</p>
          <p className="text-sm text-near-black">{icebreakerPrompt}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-8">
            say hi — use the icebreaker above to get started
          </p>
        )}
        <AnimatePresence initial={false}>
          {messages.map(msg => {
            const isMe = msg.sender_id === currentUserId
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-coral text-white rounded-br-sm'
                      : 'bg-gray-100 text-near-black rounded-bl-sm'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? 'text-orange-200' : 'text-gray-400'}`}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 py-4 border-t border-gray-100">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="say something..."
          className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-coral transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="bg-coral text-white px-5 py-3 rounded-2xl font-medium text-sm hover:bg-[#d44e33] active:scale-[0.98] transition-all duration-150 disabled:opacity-50"
        >
          send
        </button>
      </form>
    </main>
  )
}
