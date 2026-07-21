export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'locked'
export type LocationType = 'rack' | 'bulk' | 'staging' | 'dock' | 'quarantine' | 'damaged' | 'virtual'
export type LocationStatus = 'available' | 'occupied' | 'reserved' | 'blocked' | 'maintenance'
export type SkuStatus = 'active' | 'inactive' | 'discontinued' | 'pending'
export type OrderStatus = 'pending' | 'allocated' | 'picking' | 'packed' | 'dispatched' | 'cancelled' | 'on_hold'
export type PoStatus = 'draft' | 'submitted' | 'partially_received' | 'fully_received' | 'cancelled' | 'closed'
export type GrnStatus = 'draft' | 'in_progress' | 'qc_pending' | 'completed' | 'rejected'
export type QcStatus = 'pending' | 'in_progress' | 'passed' | 'failed' | 'conditional_pass'
export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'failed'
export type AdjustmentReason = 'cycle_count' | 'damage' | 'expiry' | 'system_correction' | 'receiving_error' | 'picking_error' | 'theft' | 'other'
export type WaveStatus = 'draft' | 'released' | 'picking' | 'completed' | 'cancelled'
export type ShipmentStatus = 'planned' | 'loading' | 'dispatched' | 'delivered' | 'returned'
export type ReplenishmentTrigger = 'min_max' | 'demand_based' | 'manual' | 'auto'
export type CountType = 'full' | 'partial' | 'random' | 'abc_cycle' | 'perpetual'

export type RoleCode =
  | 'warehouse_manager'
  | 'operations_supervisor'
  | 'receiving_clerk'
  | 'qc_inspector'
  | 'putaway_operator'
  | 'inventory_controller'
  | 'replenishment_operator'
  | 'picker'
  | 'packer'
  | 'dispatch_clerk'
  | 'cycle_count_auditor'
  | 'driver'
  | 'supplier_portal'
  | 'store_portal'
  | 'system_admin'
  | 'report_viewer'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
          deleted_at: string | null
          status: UserStatus
          version: number
          user_id: string
          employee_id: string | null
          full_name: string
          email: string
          phone: string | null
          job_title: string | null
          department: string | null
          warehouse_id: string | null
          default_zone_id: string | null
          language_code: string
          timezone: string
          pin_hash: string | null
          rf_device_id: string | null
          last_login_at: string | null
          failed_login_count: number
          locked_until: string | null
          avatar_url: string | null
          preferences: Json
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at' | 'version'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      roles: {
        Row: {
          id: string; created_at: string; updated_at: string
          created_by: string | null; updated_by: string | null
          deleted_at: string | null; status: string; version: number
          role_code: RoleCode; role_name: string
          description: string | null; is_system_role: boolean; permissions: Json
        }
        Insert: Omit<Database['public']['Tables']['roles']['Row'], 'id' | 'created_at' | 'updated_at' | 'version'>
        Update: Partial<Database['public']['Tables']['roles']['Insert']>
      }
      permissions: {
        Row: {
          id: string; created_at: string; updated_at: string
          created_by: string | null; updated_by: string | null
          deleted_at: string | null; status: string; version: number
          permission_code: string; module: string
          action: string; description: string | null
        }
        Insert: Omit<Database['public']['Tables']['permissions']['Row'], 'id' | 'created_at' | 'updated_at' | 'version'>
        Update: Partial<Database['public']['Tables']['permissions']['Insert']>
      }
      role_permissions: {
        Row: {
          id: string; created_at: string; updated_at: string
          created_by: string | null; updated_by: string | null
          deleted_at: string | null; status: string; version: number
          role_id: string; permission_id: string
        }
        Insert: Omit<Database['public']['Tables']['role_permissions']['Row'], 'id' | 'created_at' | 'updated_at' | 'version'>
        Update: Partial<Database['public']['Tables']['role_permissions']['Insert']>
      }
      user_roles: {
        Row: {
          id: string; created_at: string; updated_at: string
          created_by: string | null; updated_by: string | null
          deleted_at: string | null; status: string; version: number
          user_id: string; role_id: string
          assigned_at: string; assigned_by: string | null; expires_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['user_roles']['Row'], 'id' | 'created_at' | 'updated_at' | 'version'>
        Update: Partial<Database['public']['Tables']['user_roles']['Insert']>
      }
      user_sessions: {
        Row: {
          id: string; created_at: string; updated_at: string
          created_by: string | null; updated_by: string | null
          deleted_at: string | null; status: string; version: number
          user_id: string; session_token: string | null
          device_type: string | null; device_id: string | null
          ip_address: string | null; started_at: string
          last_activity_at: string | null; ended_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['user_sessions']['Row'], 'id' | 'created_at' | 'updated_at' | 'version'>
        Update: Partial<Database['public']['Tables']['user_sessions']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: {
      fn_has_role: { Args: { p_role: string }; Returns: boolean }
      fn_is_admin_or_manager: { Args: Record<string, never>; Returns: boolean }
      fn_current_user_roles: { Args: Record<string, never>; Returns: string[] }
    }
    Enums: {
      user_status: UserStatus
      role_code: RoleCode
      task_status: TaskStatus
      order_status: OrderStatus
      po_status: PoStatus
      grn_status: GrnStatus
      qc_status: QcStatus
      wave_status: WaveStatus
      shipment_status: ShipmentStatus
    }
  }
  audit: {
    Tables: {
      audit_log: {
        Row: {
          id: string; table_name: string; record_id: string
          operation: 'INSERT' | 'UPDATE' | 'DELETE'
          old_data: Json | null; new_data: Json | null
          changed_fields: string[] | null
          performed_by: string | null; performed_at: string
          ip_address: string | null; device_id: string | null
          session_id: string | null; application_name: string | null
        }
        Insert: Omit<Database['audit']['Tables']['audit_log']['Row'], 'id'>
        Update: Partial<Database['audit']['Tables']['audit_log']['Insert']>
      }
      user_activity_log: {
        Row: {
          id: string; logged_at: string; user_id: string
          session_id: string | null; action_type: string
          module: string; reference_type: string | null
          reference_id: string | null; description: string | null
          ip_address: string | null; device_id: string | null
          metadata: Json | null
        }
        Insert: Omit<Database['audit']['Tables']['user_activity_log']['Row'], 'id'>
        Update: Partial<Database['audit']['Tables']['user_activity_log']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Role = Database['public']['Tables']['roles']['Row']
export type Permission = Database['public']['Tables']['permissions']['Row']
export type UserRole = Database['public']['Tables']['user_roles']['Row']
export type AuditLog = Database['audit']['Tables']['audit_log']['Row']
export type UserActivityLog = Database['audit']['Tables']['user_activity_log']['Row']