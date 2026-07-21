import type { PermissionCode } from './permissions'
import type { RoleCode } from '@/types/database'

const ROLE_PERMISSION_MAP: Record<RoleCode, PermissionCode[]> = {
  warehouse_manager: ['view_dashboard', 'manage_inventory', 'manage_users'],
  operations_supervisor: ['view_dashboard', 'manage_inventory'],
  receiving_clerk: ['view_dashboard'],
  qc_inspector: ['view_dashboard'],
  putaway_operator: ['view_dashboard'],
  inventory_controller: ['view_dashboard', 'manage_inventory'],
  replenishment_operator: ['view_dashboard'],
  picker: ['view_dashboard'],
  packer: ['view_dashboard'],
  dispatch_clerk: ['view_dashboard'],
  cycle_count_auditor: ['view_dashboard'],
  driver: ['view_dashboard'],
  supplier_portal: ['view_dashboard'],
  store_portal: ['view_dashboard'],
  system_admin: ['view_dashboard', 'manage_inventory', 'manage_users'],
  report_viewer: ['view_dashboard'],
}

export function getPermissionsForRoles(roles: RoleCode[]): PermissionCode[] {
  const permissions = new Set<PermissionCode>()
  for (const role of roles) {
    for (const permission of ROLE_PERMISSION_MAP[role] ?? []) {
      permissions.add(permission)
    }
  }
  return Array.from(permissions)
}

export function hasPermission(userPermissions: PermissionCode[], permission: PermissionCode) {
  return userPermissions.includes(permission)
}

export function hasAnyPermission(userPermissions: PermissionCode[], permissions: PermissionCode[]) {
  return permissions.some((permission) => hasPermission(userPermissions, permission))
}

export function hasAllPermissions(userPermissions: PermissionCode[], permissions: PermissionCode[]) {
  return permissions.every((permission) => hasPermission(userPermissions, permission))
}
