import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Sign In' }

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Suspense fallback={<div className="animate-pulse space-y-4">...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
