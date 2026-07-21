'use client'

import { useAuthStore } from '@/store/auth.store'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/rbac/roles'
import type { PermissionCode } from '@/lib/rbac/permissions'
import type { RoleCode } from '@/types/database'

export function usePermissions() {
  const { user } = useAuthStore()
  const userPermissions = user?.permissions ?? []
  const userRoles = user?.roles ?? []

  return {
    hasPermission: (p: PermissionCode) => hasPermission(userPermissions, p),
    hasAnyPermission: (ps: PermissionCode[]) => hasAnyPermission(userPermissions, ps),
    hasAllPermissions: (ps: PermissionCode[]) => hasAllPermissions(userPermissions, ps),
    hasRole: (role: RoleCode) => userRoles.includes(role),
    hasAnyRole: (roles: RoleCode[]) => roles.some((r) => userRoles.includes(r)),
    isAdmin: () => userRoles.includes('system_admin'),
    isManager: () => userRoles.includes('warehouse_manager') || userRoles.includes('system_admin'),
    permissions: userPermissions,
    roles: userRoles,
  }
}