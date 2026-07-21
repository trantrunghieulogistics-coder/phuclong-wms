'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/lib/services/auth.service'
import type { LoginCredentials, ForgotPasswordData, ResetPasswordData } from '@/types/auth'
import { toast } from 'sonner'

export function useAuth() {
  const router = useRouter()
  const { user, session, isLoading, isAuthenticated, setUser, setSession, setLoading, reset } = useAuthStore()

  const loadUser = useCallback(async () => {
    setLoading(true)
    try { const authUser = await authService.getCurrentUser(); setUser(authUser) }
    catch { reset() }
    finally { setLoading(false) }
  }, [setUser, setLoading, reset])

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return; setSession(s)
      if (s) loadUser(); else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return; setSession(s)
        if (event === 'SIGNED_IN' && s) await loadUser()
        else if (event === 'SIGNED_OUT') { reset(); router.push('/login') }
        else if (event === 'TOKEN_REFRESHED' && s) setSession(s)
        else if (event === 'USER_UPDATED') await loadUser()
      })

    return () => { mounted = false; subscription.unsubscribe() }
  }, [loadUser, setSession, setLoading, reset, router])

  const signIn = async (credentials: LoginCredentials) => {
    const { data, error } = await authService.signIn(credentials)
    if (error) throw error; if (data) setUser(data); return data
  }

  const signOut = async () => {
    const { error } = await authService.signOut()
    if (error) { toast.error('Sign out failed.'); return }
    reset(); router.push('/login')
  }

  const forgotPassword = async (data: ForgotPasswordData) => {
    const result = await authService.forgotPassword(data)
    if (result.error) throw result.error
  }

  const resetPassword = async (data: ResetPasswordData) => {
    const result = await authService.resetPassword(data)
    if (result.error) throw result.error
  }

  return { user, session, isLoading, isAuthenticated, signIn, signOut, forgotPassword, resetPassword, reloadUser: loadUser }
}