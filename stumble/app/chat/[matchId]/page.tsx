import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ChatClient from './ChatClient'

export default async function ChatPage({ params }: { params: { matchId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Verify user is part of this match
  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('id', params.matchId)
    .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id},user_3_id.eq.${user.id}`)
    .single()

  if (!match) return notFound()

  // Fetch initial messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', params.matchId)
    .order('created_at', { ascending: true })

  // Fetch other users in match
  const otherIds = [match.user_1_id, match.user_2_id, match.user_3_id]
    .filter(Boolean)
    .filter((id: string) => id !== user.id)

  const { data: otherUsers } = await supabase
    .from('users')
    .select('id, name, email')
    .in('id', otherIds)

  return (
    <ChatClient
      matchId={params.matchId}
      icebreakerPrompt={match.icebreaker_prompt}
      initialMessages={messages || []}
      currentUserId={user.id}
      otherUsers={otherUsers || []}
    />
  )
}
