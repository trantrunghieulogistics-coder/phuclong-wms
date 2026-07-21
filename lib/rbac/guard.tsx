'use client'

import { usePermissions } from '@/hooks/use-permissions'
import type { PermissionCode } from './permissions'

interface PermissionGuardProps {
  permission?: PermissionCode
  permissions?: PermissionCode[]
  requireAll?: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({
  permission, permissions, requireAll = false, fallback = null, children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  let isAllowed = false

  if (permission) {
    isAllowed = hasPermission(permission)
  } else if (permissions) {
    isAllowed = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions)
  } else {
    isAllowed = true
  }

  if (!isAllowed) return <>{fallback}</>
  return <>{children}</>
}