import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Orders' }

const orders = [
  { id: 'ORD-001', channel: 'B2B', status: 'Picking', customer: 'Cửa hàng Hà Nội' },
  { id: 'ORD-002', channel: 'B2C', status: 'Packed', customer: 'Khách hàng online' },
  { id: 'ORD-003', channel: 'B2B', status: 'Ready to Dispatch', customer: 'Đại lý Đà Nẵng' },
]

export default function OrdersPage() {
  return (
    <main className="p-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground">Outbound order lifecycle and dispatch tracking.</p>

        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.customer}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{order.channel}</p>
                <p className="text-sm text-muted-foreground">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
