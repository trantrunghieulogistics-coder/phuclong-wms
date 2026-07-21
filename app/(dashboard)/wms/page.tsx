import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'WMS' }

const modules = [
  { name: 'Inventory', href: '/wms/inventory', description: 'SKU, stock, location overview' },
  { name: 'Picking', href: '/wms/picking', description: 'B2B and B2C picking workflow' },
  { name: 'Orders', href: '/wms/orders', description: 'Outbound orders and dispatch status' },
  { name: 'Replenishment', href: '/wms/replenishment', description: 'Store and zone replenishment' },
]

export default function WmsPage() {
  return (
    <main className="p-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">WMS Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Warehouse operations for Phúc Long: inventory, picking, orders, and replenishment.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <a
            key={module.name}
            href={module.href}
            className="rounded-xl border bg-white p-5 shadow-sm transition hover:border-black"
          >
            <h2 className="font-semibold">{module.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{module.description}</p>
          </a>
        ))}
      </div>
    </main>
  )
}
