import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Inventory' }

const items = [
  { sku: 'PL-001', name: 'Cà phê Classic', location: 'A-01-02', stock: 120, status: 'Available' },
  { sku: 'PL-002', name: 'Trà Oolong', location: 'B-03-01', stock: 85, status: 'Reserved' },
  { sku: 'PL-003', name: 'Nước cam', location: 'C-02-04', stock: 40, status: 'Low Stock' },
]

export default function InventoryPage() {
  return (
    <main className="p-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Inventory</h1>
            <p className="text-sm text-muted-foreground">Master inventory and location overview.</p>
          </div>
          <button className="rounded-md border px-3 py-2 text-sm">+ Add SKU</button>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.sku} className="border-t">
                  <td className="px-4 py-3 font-medium">{item.sku}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.location}</td>
                  <td className="px-4 py-3">{item.stock}</td>
                  <td className="px-4 py-3">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
