import type { User, Session } from '@supabase/supabase-js'
import type { Profile, RoleCode } from './database'

export interface AuthUser {
  id: string
  email: string
  profile: Profile
  roles: RoleCode[]
  permissions: string[]
}

export interface AuthState {
  user: AuthUser | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  employeeId?: string
  phone?: string
  jobTitle?: string
  department?: string
}

export interface ForgotPasswordData { email: string }

export interface ResetPasswordData {
  password: string
  confirmPassword: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface AuthError {
  message: string
  code?: string
  status?: number
}

export interface AuthResponse<T = void> {
  data: T | null
  error: AuthError | null
}

export type AuthAction =
  | 'login' | 'logout' | 'register' | 'forgot_password'
  | 'reset_password' | 'change_password' | 'session_refresh' | 'profile_update'