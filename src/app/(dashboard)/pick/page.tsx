'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PickTask } from '@/types'
import { 
  ClipboardDocumentListIcon,
  PlusIcon,
  QrCodeIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function PickListPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<PickTask[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchTasks()
    const subscription = supabase
      .channel('pick_tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pick_tasks' }, () => {
        fetchTasks()
      })
      .subscribe()
    return () => { subscription.unsubscribe() }
  }, [filter])

  const fetchTasks = async () => {
    setLoading(true)
    let query = supabase
      .from('pick_tasks')
      .select('*, items:pick_task_items(*), picker:profiles(full_name)')
      .order('created_at', { ascending: false })

    if (filter) query = query.eq('status', filter)

    const { data, error } = await query
    if (error) {
      toast.error('Lỗi tải pick tasks: ' + error.message)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      open: 'Chờ xử lý',
      in_progress: 'Đang pick',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
    }
    return labels[status] || status
  }

  const createPickTask = async () => {
    const { data: pendingOrders, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('status', 'pending')
      .limit(10)

    if (error || !pendingOrders || pendingOrders.length === 0) {
      toast.error('Không có đơn hàng chờ xử lý')
      return
    }

    const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const { count } = await supabase
      .from('pick_tasks')
      .select('*', { count: 'exact', head: true })
      .ilike('task_code', `PICK-${today}%`)
    
    const seq = String((count || 0) + 1).padStart(3, '0')
    const taskCode = `PICK-${today}-${seq}`

    const { data: task, error: taskError } = await supabase
      .from('pick_tasks')
      .insert({
        task_code: taskCode,
        status: 'open',
        created_by: '00000000-0000-0000-0000-000000000000',
      })
      .select()
      .single()

    if (taskError) {
      toast.error('Lỗi tạo pick task: ' + taskError.message)
      return
    }

    const allItems = pendingOrders.flatMap(order => 
      order.items.map((item: any) => ({
        task_id: task.id,
        sku: item.sku,
        location: 'A-01-01',
        quantity_needed: item.quantity,
      }))
    )

    if (allItems.length > 0) {
      await supabase.from('pick_task_items').insert(allItems)
    }

    for (const order of pendingOrders) {
      await supabase.from('orders').update({ status: 'picking' }).eq('id', order.id)
    }

    toast.success(`Đã tạo pick task ${taskCode}`)
    fetchTasks()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pick hàng</h1>
        <button onClick={createPickTask} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Tạo Pick Task
        </button>
      </div>

      <div className="card flex gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="open">Chờ xử lý</option>
          <option value="in_progress">Đang pick</option>
          <option value="completed">Hoàn thành</option>
        </select>
        <button onClick={fetchTasks} className="btn-secondary">Làm mới</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8">Đang tải...</div>
        ) : tasks.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            Chưa có pick task nào
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => router.push(`/pick/${task.id}`)}
              className="card cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-phuc-long-green"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{task.task_code}</h3>
                  <p className="text-sm text-gray-500">
                    {task.items?.length || 0} items cần pick
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                  {getStatusLabel(task.status)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {task.picker_name || 'Chưa gán'}
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  {new Date(task.created_at).toLocaleString('vi-VN')}
                </div>
              </div>

              {task.status === 'open' && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/pick/${task.id}`)
                    }}
                    className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1"
                  >
                    <QrCodeIcon className="w-4 h-4" />
                    Bắt đầu Pick
                  </button>
                </div>
              )}

              {task.status === 'in_progress' && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/pick/${task.id}`)
                    }}
                    className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1"
                  >
                    <QrCodeIcon className="w-4 h-4" />
                    Tiếp tục Pick
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}