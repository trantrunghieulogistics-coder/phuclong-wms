'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { PickTask, PickTaskItem } from '@/types'
import { Html5QrcodeScanner } from 'html5-qrcode'
import {
  ArrowLeftIcon,
  QrCodeIcon,
  CheckCircleIcon,
  MapPinIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function PickDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  const [task, setTask] = useState<PickTask | null>(null)
  const [items, setItems] = useState<PickTaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)
  const [scannedSku, setScannedSku] = useState('')

  useEffect(() => {
    fetchTaskDetail()
  }, [taskId])

  const fetchTaskDetail = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('pick_tasks')
      .select('*, items:pick_task_items(*), picker:profiles(full_name)')
      .eq('id', taskId)
      .single()

    if (error) {
      toast.error('Lỗi tải chi tiết: ' + error.message)
      router.push('/pick')
    } else {
      setTask(data)
      setItems(data.items || [])
    }
    setLoading(false)
  }

  const startPicking = async () => {
    const { error } = await supabase
      .from('pick_tasks')
      .update({ status: 'in_progress', picker_id: '00000000-0000-0000-0000-000000000000' })
      .eq('id', taskId)

    if (error) {
      toast.error('Lỗi: ' + error.message)
    } else {
      toast.success('Bắt đầu pick hàng')
      fetchTaskDetail()
    }
  }

  const completeTask = async () => {
    const allPicked = items.every(item => item.quantity_picked >= item.quantity_needed)
    if (!allPicked) {
      toast.error('Chưa pick đủ tất cả items')
      return
    }

    const { error } = await supabase
      .from('pick_tasks')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', taskId)

    if (error) {
      toast.error('Lỗi: ' + error.message)
    } else {
      toast.success('Hoàn thành pick task!')
      router.push('/pick')
    }
  }

  const updatePickedQuantity = async (itemId: string, quantity: number) => {
    const { error } = await supabase
      .from('pick_task_items')
      .update({ 
        quantity_picked: quantity,
        picked_at: new Date().toISOString()
      })
      .eq('id', itemId)

    if (error) {
      toast.error('Lỗi cập nhật: ' + error.message)
    } else {
      fetchTaskDetail()
    }
  }

  const startScanner = useCallback(() => {
    setScanning(true)
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      )

      scanner.render(
        (decodedText: string) => {
          setScannedSku(decodedText)
          handleScan(decodedText)
          scanner.clear()
          setScanning(false)
        },
        (error: any) => {
          console.warn('QR scan error:', error)
        }
      )
    }, 100)
  }, [])

  const handleScan = (sku: string) => {
    const matchedItem = items.find(item => item.sku === sku)
    if (!matchedItem) {
      toast.error(`Không tìm thấy SKU ${sku} trong task này`)
      return
    }

    if (matchedItem.quantity_picked >= matchedItem.quantity_needed) {
      toast.info(`SKU ${sku} đã pick đủ`)
      return
    }

    const newQuantity = matchedItem.quantity_picked + 1
    updatePickedQuantity(matchedItem.id, newQuantity)
    toast.success(`Đã pick ${sku} (${newQuantity}/${matchedItem.quantity_needed})`)
  }

  const progress = items.length > 0
    ? Math.round((items.reduce((sum, item) => sum + item.quantity_picked, 0) / 
        items.reduce((sum, item) => sum + item.quantity_needed, 0)) * 100)
    : 0

  if (loading) {
    return <div className="flex items-center justify-center h-full">Đang tải...</div>
  }

  if (!task) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/pick')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{task.task_code}</h1>
          <p className="text-sm text-gray-500">Pick Task Detail</p>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Tiến độ</span>
          <span className="text-sm font-bold text-phuc-long-green">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-phuc-long-green h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {task.status === 'in_progress' && (
        <div className="card">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <QrCodeIcon className="w-5 h-5" />
            Quét mã SKU
          </h3>
          
          {!scanning ? (
            <button 
              onClick={startScanner}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              <QrCodeIcon className="w-5 h-5" />
              Bật camera quét QR
            </button>
          ) : (
            <div id="qr-reader" className="w-full"></div>
          )}

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={scannedSku}
              onChange={(e) => setScannedSku(e.target.value)}
              placeholder="Nhập SKU thủ công..."
              className="input-field flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleScan(scannedSku)}
            />
            <button 
              onClick={() => handleScan(scannedSku)}
              className="btn-primary px-4"
            >
              Xác nhận
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold mb-4">Danh sách items ({items.length})</h3>
        <div className="space-y-3">
          {items.map((item) => {
            const isComplete = item.quantity_picked >= item.quantity_needed
            return (
              <div 
                key={item.id} 
                className={`p-4 rounded-lg border-2 transition-colors ${
                  isComplete ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <ArchiveBoxIcon className="w-5 h-5 text-gray-500" />
                      <span className="font-bold text-lg">{item.sku}</span>
                      {isComplete && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {item.quantity_picked} <span className="text-gray-400 text-lg">/ {item.quantity_needed}</span>
                    </div>
                  </div>
                </div>

                {task.status === 'in_progress' && !isComplete && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => updatePickedQuantity(item.id, item.quantity_picked + 1)}
                      className="flex-1 bg-phuc-long-green text-white py-2 rounded-lg hover:bg-phuc-long-dark transition-colors"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => updatePickedQuantity(item.id, item.quantity_needed)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Pick đủ
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex gap-4">
        {task.status === 'open' && (
          <button onClick={startPicking} className="flex-1 btn-primary py-3 text-lg">
            Bắt đầu Pick
          </button>
        )}
        
        {task.status === 'in_progress' && (
          <button onClick={completeTask} className="flex-1 btn-primary py-3 text-lg">
            Hoàn thành Task
          </button>
        )}
      </div>
    </div>
  )
}