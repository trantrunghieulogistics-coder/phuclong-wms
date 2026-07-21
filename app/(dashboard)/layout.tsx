import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const LOGIN_ROUTE = '/login' as const

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect(LOGIN_ROUTE)

  const { data: profile } = await supabase.from('profiles')
    .select('id, status, locked_until')
    .eq('user_id', user.id).single()

  const profileStatus = (profile as { status?: string } | null)?.status
  if (!profile || profileStatus !== 'active') redirect('/login?error=account_inactive')
  const lockedUntil = (profile as { locked_until?: string | null } | null)?.locked_until
  if (lockedUntil && new Date(lockedUntil) > new Date())
    redirect('/login?error=account_locked')

  return <>{children}</>
}