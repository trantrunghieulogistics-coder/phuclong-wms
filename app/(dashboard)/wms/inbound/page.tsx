import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Inbound' }

const inboundTasks = [
  { id: 'IN-001', supplier: 'Supplier A', sku: 'PL-001', qty: 120, status: 'Received' },
  { id: 'IN-002', supplier: 'Supplier B', sku: 'PL-002', qty: 80, status: 'Putaway Pending' },
]

export default function InboundPage() {
  return (
    <main className="p-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Inbound & Putaway</h1>
        <p className="mt-2 text-sm text-muted-foreground">Receiving workflow for incoming goods and putaway to storage locations.</p>

        <div className="mt-6 space-y-3">
          {inboundTasks.map((task) => (
            <div key={task.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{task.id}</p>
                  <p className="text-sm text-muted-foreground">Supplier: {task.supplier}</p>
                </div>
                <div className="text-right text-sm">
                  <p>{task.sku}</p>
                  <p className="text-muted-foreground">Qty: {task.qty}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{task.status}</span>
                <button className="rounded-md border px-3 py-2 text-sm">Putaway</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
