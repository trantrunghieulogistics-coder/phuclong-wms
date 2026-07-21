import { WmsSidebar } from '@/components/wms/wms-sidebar'

export default function WmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <WmsSidebar />
      <div className="flex-1">{children}</div>
    </div>
  )
}
