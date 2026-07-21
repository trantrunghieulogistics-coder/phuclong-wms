import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getPermissionsForRoles } from '@/lib/rbac/roles'
import type { RoleCode } from '@/types/database'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('*')
      .eq('user_id', user.id).eq('status', 'active').is('deleted_at', null).single()
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    const { data: userRoles } = await supabase.from('user_roles').select('roles(role_code)')
      .eq('user_id', user.id).is('deleted_at', null)

    const roles = (userRoles?.map((ur: any) => ur.roles?.role_code).filter(Boolean) as RoleCode[]) ?? []
    const permissions = getPermissionsForRoles(roles)

    return NextResponse.json({ id: user.id, email: user.email, profile, roles, permissions })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}