import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Pick Task Detail' }

const task = {
  id: 'PT-123',
  channel: 'B2B',
  customer: 'Cửa hàng Hà Nội',
  method: 'Case Pick',
  status: 'In Progress',
  items: [
    { sku: 'PL-001', name: 'Cà phê Classic', qty: 12, location: 'A-01-02' },
    { sku: 'PL-002', name: 'Trà Oolong', qty: 8, location: 'B-03-01' },
    { sku: 'PL-003', name: 'Nước cam', qty: 5, location: 'C-02-04' },
  ],
}

export default function PickTaskDetailPage() {
  return (
    <main className="p-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Pick Task Detail</h1>
            <p className="mt-2 text-sm text-muted-foreground">Task {task.id} for {task.customer}</p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">{task.status}</span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-lg border p-4">
            <h2 className="font-semibold">Task items</h2>
            <div className="mt-4 space-y-3">
              {task.items.map((item) => (
                <div key={item.sku} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{item.sku}</p>
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>Qty: {item.qty}</p>
                    <p className="text-muted-foreground">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border p-4">
            <h2 className="font-semibold">Task summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Channel</span>
                <span>{task.channel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span>{task.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span>{task.items.length}</span>
              </div>
            </div>

            <button className="mt-6 w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white">
              Complete Pick
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}
