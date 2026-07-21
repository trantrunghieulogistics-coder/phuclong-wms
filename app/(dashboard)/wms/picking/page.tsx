import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Picking' }

const b2bOrders = [
  { id: 'B2B-1001', customer: 'Cửa hàng Hà Nội', type: 'Case Pick', priority: 'High', items: 18 },
  { id: 'B2B-1002', customer: 'Đại lý Đà Nẵng', type: 'Pallet Pick', priority: 'Medium', items: 12 },
]

const b2cOrders = [
  { id: 'B2C-2001', customer: 'Khách hàng online', type: 'Batch Pick', priority: 'High', items: 6 },
  { id: 'B2C-2002', customer: 'Khách hàng online', type: 'Cluster Pick', priority: 'Medium', items: 4 },
]

export default function PickingPage() {
  return (
    <main className="p-6 space-y-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Picking Workflow</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hybrid picking flows for Phúc Long: B2B and B2C orders with different picking methods.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">B2B Orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">Bulk and wholesale orders using case or pallet picking.</p>
          <div className="mt-4 space-y-3">
            {b2bOrders.map((order) => (
              <div key={order.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{order.priority}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>{order.type}</span>
                  <span>{order.items} items</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">B2C Orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">Retail and online orders using batch or cluster picking.</p>
          <div className="mt-4 space-y-3">
            {b2cOrders.map((order) => (
              <div key={order.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{order.priority}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>{order.type}</span>
                  <span>{order.items} items</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
