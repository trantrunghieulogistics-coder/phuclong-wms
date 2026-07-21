'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Order } from '@/types'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: '', platform: '' })

  useEffect(() => {
    fetchOrders()
    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders()
      })
      .subscribe()
    return () => { subscription.unsubscribe() }
  }, [filter])

  const fetchOrders = async () => {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false })
      .limit(100)

    if (filter.status) query = query.eq('status', filter.status)
    if (filter.platform) query = query.eq('platform', filter.platform)

    const { data, error } = await query
    if (error) {
      toast.error('Lỗi tải đơn hàng: ' + error.message)
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-800',
      picking: 'bg-blue-100 text-blue-800',
      packing: 'bg-yellow-100 text-yellow-800',
      ready_to_ship: 'bg-purple-100 text-purple-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-green-200 text-green-900',
      returned: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-200 text-gray-600',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Chờ xử lý', picking: 'Đang pick', packing: 'Đang pack',
      ready_to_ship: 'Sẵn sàng giao', shipped: 'Đã giao',
      delivered: 'Đã nhận', returned: 'Hoàn đơn', cancelled: 'Đã hủy',
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push('/pick')} className="btn-primary">Tạo Pick Task</button>
          <button onClick={() => {}} className="btn-secondary">Nhập đơn</button>
        </div>
      </div>

      <div className="card flex gap-4">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="input-field w-auto"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="picking">Đang pick</option>
          <option value="packing">Đang pack</option>
          <option value="ready_to_ship">Sẵn sàng giao</option>
        </select>

        <select
          value={filter.platform}
          onChange={(e) => setFilter({ ...filter, platform: e.target.value })}
          className="input-field w-auto"
        >
          <option value="">Tất cả nền tảng</option>
          <option value="shopee">Shopee</option>
          <option value="tiktok">TikTok</option>
        </select>

        <button onClick={fetchOrders} className="btn-secondary">Làm mới</button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nền tảng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center">Đang tải...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Không có đơn hàng</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{order.platform_order_id}</div>
                      {order.so_code && <div className="text-xs text-gray-500">{order.so_code}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.platform === 'shopee' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.platform === 'shopee' ? 'Shopee' : 'TikTok'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{order.customer_name || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{order.customer_phone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.items?.length || 0} items</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 uppercase">{order.carrier || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {order.created_at && format(new Date(order.created_at), 'HH:mm dd/MM', { locale: vi })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}