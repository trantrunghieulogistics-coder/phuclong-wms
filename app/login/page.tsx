import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.95),_rgba(30,41,59,0.85))] p-4 sm:p-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between bg-slate-950 p-8 text-white sm:p-10">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              Phúc Long WMS
            </div>
            <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
              Warehouse operations, simplified.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300 sm:text-base">
              Manage inventory, picking, and dispatch with a streamlined control center designed for modern warehouse teams.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200">
            <p className="font-medium">Why teams choose this platform</p>
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>• Secure access for warehouse and admin users</li>
              <li>• Fast order and picking workflows</li>
              <li>• Clear visibility across inventory and movement</li>
            </ul>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-50 p-6 sm:p-10">
          <Suspense fallback={<div className="h-72 w-full max-w-sm animate-pulse rounded-2xl bg-white shadow-sm" /> }>
            <LoginForm />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
