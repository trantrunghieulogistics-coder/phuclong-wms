export type Platform = 'shopee' | 'tiktok';
export type OrderStatus = 'pending' | 'picking' | 'packing' | 'ready_to_ship' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
export type Carrier = 'spx' | 'ttsl' | 'ghn' | 'ghtk' | 'viettel_post' | 'other';
export type UserRole = 'admin' | 'supervisor' | 'picker' | 'packer' | 'viewer';
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type PackagingType = 'bubble_bag' | 'carton_small' | 'carton_medium' | 'gift_box' | 'other';
export type UnitType = 'GOI' | 'HOP' | 'LON' | 'BUNDLE';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  platform: Platform;
  platform_order_id: string;
  so_code?: string;
  customer_name?: string;
  customer_phone?: string;
  address?: string;
  district?: string;
  province?: string;
  tracking_number?: string;
  carrier?: Carrier;
  status: OrderStatus;
  sla_deadline?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  sku: string;
  product_name?: string;
  quantity: number;
  unit?: UnitType;
  picked_quantity: number;
  packed_quantity: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  product_name: string;
  zone: string;
  location: string;
  quantity: number;
  reserved_quantity: number;
  expiry_date?: string;
}

export interface PickTask {
  id: string;
  task_code: string;
  status: TaskStatus;
  picker_id?: string;
  picker_name?: string;
  created_by: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  items?: PickTaskItem[];
}

export interface PickTaskItem {
  id: string;
  task_id: string;
  sku: string;
  location: string;
  quantity_needed: number;
  quantity_picked: number;
  picked_at?: string;
  picker_note?: string;
}

export interface PackTask {
  id: string;
  order_id: string;
  order?: Order;
  status: TaskStatus;
  packer_id?: string;
  packer_name?: string;
  packed_at?: string;
  defect_note?: string;
  packaging_type?: PackagingType;
}

export interface DashboardStats {
  total_orders_today: number;
  pending_orders: number;
  picking_orders: number;
  packing_orders: number;
  ready_to_ship: number;
  late_dispatches: number;
  pick_accuracy: number;
  avg_processing_time: number;
}