import { createClient } from '@/lib/supabase/server'
import MatchesClient from './MatchesClient'

export default async function MatchesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get current week number
  const weekNumber = Math.ceil(
    (Date.now() - new Date('2024-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000)
  )

  // Fetch matches for this user
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id},user_3_id.eq.${user.id}`)
    .eq('week_number', weekNumber)
    .order('created_at', { ascending: false })

  // Fetch matched users' profiles
  const matchesWithProfiles = await Promise.all(
    (matches || []).map(async (match) => {
      const otherIds = [match.user_1_id, match.user_2_id, match.user_3_id]
        .filter(Boolean)
        .filter((id: string) => id !== user.id)

      const { data: profiles } = await supabase
        .from('users')
        .select('id, name, email, vibe_summary')
        .in('id', otherIds)

      return { ...match, profiles: profiles || [] }
    })
  )

  return <MatchesClient matches={matchesWithProfiles} userId={user.id} />
}
