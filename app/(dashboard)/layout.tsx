import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')

  const { data: profile } = await supabase.from('profiles')
    .select('id, status, locked_until')
    .eq('user_id', user.id).single()

  if (!profile || profile.status !== 'active') redirect('/login?error=account_inactive')
  if (profile.locked_until && new Date(profile.locked_until) > new Date())
    redirect('/login?error=account_locked')

  return <>{children}</>
}