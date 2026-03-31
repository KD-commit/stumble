import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

// This route is called by a cron job every Monday
// Protect it with a secret header in production
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const weekNumber = Math.ceil(
    (Date.now() - new Date('2024-01-01').getTime()) / (7 * 24 * 60 * 60 * 1000)
  )

  // Get all matches for this week
  const { data: matches } = await supabase
    .from('matches')
    .select('user_1_id, user_2_id, user_3_id')
    .eq('week_number', weekNumber)

  if (!matches) return NextResponse.json({ sent: 0 })

  // Collect all unique user IDs
  const allIds = matches.flatMap(m => [m.user_1_id, m.user_2_id, m.user_3_id].filter(Boolean))
  const userIds = Array.from(new Set(allIds))

  const { data: users } = await supabase
    .from('users')
    .select('id, email, name')
    .in('id', userIds)

  let sent = 0
  for (const user of users || []) {
    const name = user.name || user.email.split('@')[0]
    await resend.emails.send({
      from: 'stumble <hello@stumble.app>',
      to: user.email,
      subject: 'your matches are ready 🌀',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1A1A1A;">
          <p style="color: #E8593C; font-weight: 600; font-size: 18px; margin-bottom: 24px;">stumble</p>
          <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 12px;">hey ${name}, your matches are ready.</h1>
          <p style="color: #6B7280; line-height: 1.6; margin-bottom: 32px;">
            three people on your campus who actually get you are waiting. go say hi.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/matches"
             style="display: inline-block; background: #E8593C; color: white; font-weight: 600; padding: 16px 32px; border-radius: 16px; text-decoration: none; font-size: 16px;">
            see your matches
          </a>
          <p style="color: #9CA3AF; font-size: 12px; margin-top: 40px;">
            stumble — find your people
          </p>
        </div>
      `,
    })
    sent++
  }

  return NextResponse.json({ sent })
}
