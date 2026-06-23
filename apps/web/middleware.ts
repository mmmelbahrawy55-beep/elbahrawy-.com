import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Check if user is authenticated from localStorage (for client-side routes)
    // Note: Middleware doesn't have access to localStorage, so we'll handle client-side too
    // This is just a basic check - real auth would use cookies/JWT
    const isApiRoute = request.nextUrl.pathname.startsWith('/api')
    
    // For now, redirect unauthenticated users to home
    // The actual auth check will be done client-side in the dashboard
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/site-data/:path*'],
}
