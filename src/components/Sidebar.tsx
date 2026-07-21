'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Tổng quan', href: '/', icon: HomeIcon },
  { name: 'Đơn hàng', href: '/orders', icon: ShoppingBagIcon },
  { name: 'Pick hàng', href: '/pick', icon: QrCodeIcon },
  { name: 'Pack hàng', href: '/pack', icon: ClipboardDocumentListIcon },
  { name: 'Tồn kho', href: '/inventory', icon: ArchiveBoxIcon },
  { name: 'Báo cáo', href: '/reports', icon: ChartBarIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-screen">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-phuc-long-green">Phúc Long FC</h1>
        <p className="text-sm text-gray-500">WMS System</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-phuc-long-green text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center px-4 py-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Hệ thống hoạt động
        </div>
      </div>
    </div>
  )
}