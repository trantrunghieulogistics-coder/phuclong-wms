import { createClient } from '@/lib/supabase/client'
import type { AuthResponse, LoginCredentials, ForgotPasswordData, ResetPasswordData } from '@/types/auth'
import type { AuthUser } from '@/types/auth'
import type { RoleCode } from '@/types/database'
import { getPermissionsForRoles } from '@/lib/rbac/roles'

class AuthService {
  private getClient() { return createClient() }

  async signIn(credentials: LoginCredentials): Promise<AuthResponse<AuthUser>> {
    const supabase = this.getClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email, password: credentials.password,
    })
    if (error) {
      return { data: null, error: {
        message: this.mapAuthError(error.message),
        code: error.status?.toString(), status: error.status,
      }}
    }
    if (!data.user) return { data: null, error: { message: 'Authentication failed.' } }

    const authUser = await this.buildAuthUser(data.user.id, data.user.email!)
    if (!authUser) return { data: null, error: { message: 'Failed to load user profile.' } }

    await this.logActivity(data.user.id, 'login', 'auth', undefined, undefined, 'User signed in')
    return { data: authUser, error: null }
  }

  async signOut(): Promise<AuthResponse> {
    const supabase = this.getClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await this.logActivity(user.id, 'logout', 'auth', undefined, undefined, 'User signed out')
    const { error } = await supabase.auth.signOut()
    if (error) return { data: null, error: { message: error.message, status: error.status } }
    return { data: null, error: null }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    const supabase = this.getClient()
    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, { redirectTo })
    if (error) return { data: null, error: { message: error.message } }
    return { data: null, error: null }
  }

  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    const supabase = this.getClient()
    const { error } = await supabase.auth.updateUser({ password: data.password })
    if (error) return { data: null, error: { message: error.message } }
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await this.logActivity(user.id, 'reset_password', 'auth', undefined, undefined, 'Password reset completed')
    return { data: null, error: null }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = this.getClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    return this.buildAuthUser(user.id, user.email!)
  }

  private async buildAuthUser(userId: string, email: string): Promise<AuthUser | null> {
    const supabase = this.getClient()
    const { data: profile } = await supabase
      .from('profiles').select('*')
      .eq('user_id', userId).eq('status', 'active').is('deleted_at', null).single()
    if (!profile) return null

    const lockedUntil = (profile as { locked_until?: string | null } | null)?.locked_until
    if (lockedUntil && new Date(lockedUntil) > new Date()) {
      throw new Error(`Account locked until ${new Date(lockedUntil).toLocaleString()}`)
    }

    const { data: userRoles } = await supabase
      .from('user_roles').select('roles(role_code)')
      .eq('user_id', userId).is('deleted_at', null)

    const roles = (userRoles
      ?.map((ur: any) => ur.roles?.role_code)
      .filter(Boolean) as RoleCode[]) ?? []

    const permissions = getPermissionsForRoles(roles)

    await (supabase as any).from('profiles')
      .update({ last_login_at: new Date().toISOString(), failed_login_count: 0 })
      .eq('user_id', userId)

    return { id: userId, email, profile, roles, permissions }
  }

  private async logActivity(userId: string, actionType: string, module: string,
    referenceType?: string, referenceId?: string, description?: string) {
    const supabase = this.getClient()
    await (supabase as any).from('user_activity_log').insert({
      user_id: userId, action_type: actionType, module,
      reference_type: referenceType ?? null,
      reference_id: referenceId ?? null, description: description ?? null,
    })
  }

  private mapAuthError(message: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password. Please check your credentials and try again.',
      'Email not confirmed': 'Please verify your email address before signing in.',
      'User not found': 'No account found with this email address.',
      'Too many requests': 'Too many login attempts. Please wait a few minutes.',
      'User is banned': 'Your account has been suspended. Contact your administrator.',
    }
    return errorMap[message] ?? message
  }
}

export const authService = new AuthService()