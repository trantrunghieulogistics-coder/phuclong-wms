import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await (supabase as any).from('user_activity_log').insert({
        user_id: user.id, action_type: 'logout', module: 'auth', description: 'User signed out',
      })
    }
    await supabase.auth.signOut()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}