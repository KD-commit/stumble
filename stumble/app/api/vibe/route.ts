import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Fetch quiz answers
  const { data: answers } = await supabase
    .from('quiz_answers')
    .select('question_id, answer')
    .eq('user_id', user.id)
    .order('question_id')

  if (!answers || answers.length === 0) {
    return NextResponse.json({ error: 'no answers found' }, { status: 400 })
  }

  const answersText = answers
    .map(a => `Q${a.question_id}: ${a.answer}`)
    .join('\n')

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Based on these personality quiz answers, write a 2-3 sentence vibe summary for a university student. Be warm, specific, and a little playful. Write in second person (you are...). Never mention loneliness or making friends. Focus on who they are, not what they need. Answers:\n${answersText}`,
      },
    ],
  })

  const vibe = (message.content[0] as { type: string; text: string }).text

  // Save to users table
  await supabase
    .from('users')
    .update({ vibe_summary: vibe })
    .eq('id', user.id)

  return NextResponse.json({ vibe })
}
