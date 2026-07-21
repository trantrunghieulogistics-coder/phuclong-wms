'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/wms' as const, label: 'Overview', description: 'Dashboard' },
  { href: '/wms/inventory' as const, label: 'Inventory', description: 'Stock & locations' },
  { href: '/wms/picking' as const, label: 'Picking', description: 'B2B / B2C tasks' },
  { href: '/wms/picking/123' as const, label: 'Pick Task Detail', description: 'Task execution' },
  { href: '/wms/orders' as const, label: 'Orders', description: 'Outbound orders' },
  { href: '/wms/inbound' as const, label: 'Inbound', description: 'Receiving & putaway' },
]

export function WmsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 shrink-0 border-r bg-slate-50 p-4">
      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phúc Long WMS</p>
        <h2 className="mt-1 text-lg font-semibold">Warehouse Operations</h2>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg border p-3 text-left transition ${
                isActive ? 'border-black bg-white shadow-sm' : 'border-transparent bg-transparent hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="font-medium">{link.label}</div>
              <div className="text-sm text-slate-500">{link.description}</div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
