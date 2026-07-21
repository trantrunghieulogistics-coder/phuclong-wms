import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser, AuthState } from '@/types/auth'
import type { Session } from '@supabase/supabase-js'

interface AuthStore extends AuthState {
  setUser: (user: AuthUser | null) => void
  setSession: (session: Session | null) => void
  setLoading: (isLoading: boolean) => void
  reset: () => void
}

const initialState: AuthState = {
  user: null, session: null, isLoading: true, isAuthenticated: false,
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSession: (session) => set({ session }),
      setLoading: (isLoading) => set({ isLoading }),
      reset: () => set({ ...initialState, isLoading: false }),
    }),
    {
      name: 'wms-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)