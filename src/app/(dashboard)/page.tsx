'use client'

import { useEffect, useState } from 'react'
import { 
  ShoppingBagIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  TruckIcon 
} from '@heroicons/react/24/outline'
import StatsCard from '@/components/StatsCard'
import { supabase } from '@/lib/supabase'
import { DashboardStats } from '@/types'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    total_orders_today: 0,
    pending_orders: 0,
    picking_orders: 0,
    packing_orders: 0,
    ready_to_ship: 0,
    late_dispatches: 0,
    pick_accuracy: 99.5,
    avg_processing_time: 3.2,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    const today = new Date().toISOString().split('T')[0]
    
    // Total orders today
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`)
    
    // Pending
    const { count: pending } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
    
    // Picking
    const { count: picking } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'picking')
    
    // Packing
    const { count: packing } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'packing')
    
    // Ready to ship
    const { count: ready } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ready_to_ship')

    setStats({
      total_orders_today: totalOrders || 0,
      pending_orders: pending || 0,
      picking_orders: picking || 0,
      packing_orders: packing || 0,
      ready_to_ship: ready || 0,
      late_dispatches: 0,
      pick_accuracy: 99.5,
      avg_processing_time: 3.2,
    })
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Đang tải...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <button 
          onClick={fetchStats}
          className="btn-secondary text-sm"
        >
          Làm mới
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Đơn hôm nay"
          value={stats.total_orders_today}
          subtitle="Tổng đơn đã nhận"
          color="green"
          icon={<ShoppingBagIcon className="w-6 h-6" />}
        />
        <StatsCard
          title="Chờ xử lý"
          value={stats.pending_orders}
          subtitle="Cần tạo pick task"
          color="yellow"
          icon={<ClockIcon className="w-6 h-6" />}
        />
        <StatsCard
          title="Đang pick"
          value={stats.picking_orders}
          subtitle="Pick-er đang làm"
          color="blue"
          icon={<CheckCircleIcon className="w-6 h-6" />}
        />
        <StatsCard
          title="Sẵn sàng giao"
          value={stats.ready_to_ship}
          subtitle="Chờ carrier lấy"
          color="purple"
          icon={<TruckIcon className="w-6 h-6" />}
        />
      </div>

      {/* Alerts */}
      {stats.late_dispatches > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-3" />
          <div>
            <p className="font-medium text-red-800">
              Cảnh báo: {stats.late_dispatches} đơn trễ SLA
            </p>
            <p className="text-sm text-red-600">
              Cần ưu tiên xử lý ngay để tránh bị phạt
            </p>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm">Pick task PICK-20260721-001 hoàn thành</span>
            </div>
            <span className="text-xs text-gray-500">10 phút trước</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm">25 đơn mới từ Shopee</span>
            </div>
            <span className="text-xs text-gray-500">15 phút trước</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <span className="text-sm">Carrier SPX đến lấy hàng</span>
            </div>
            <span className="text-xs text-gray-500">1 giờ trước</span>
          </div>
        </div>
      </div>
    </div>
  )
}