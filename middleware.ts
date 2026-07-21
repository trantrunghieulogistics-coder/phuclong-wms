import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PUBLIC_PATHS = [
  '/login', '/register', '/forgot-password', '/reset-password',
  '/auth/callback', '/auth/confirm',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  const isStaticAsset =
    pathname.startsWith('/_next') || pathname.startsWith('/api') ||
    pathname.includes('.') || pathname === '/favicon.ico'

  if (isStaticAsset) return NextResponse.next()

  const { supabaseResponse, user } = await updateSession(request)

  if (!user) {
    if (isPublicPath) return supabaseResponse
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isPublicPath && pathname !== '/auth/callback' && pathname !== '/auth/confirm') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}