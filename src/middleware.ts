import { createServerClient, type CookieOptions } from '@supabase/ssr' // Importeer ssr helper
import { NextResponse, type NextRequest } from 'next/server'

// Noot: De Supabase client initialisatie wordt nu binnen de middleware gedaan
// met request/response objecten, niet via de helpers uit /lib/supabase.

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create an unmodified Supabase client for middleware actions
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request cookies object
          // We need to modify the response later
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ // Create new response to apply cookie changes
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request cookies object
          // We need to modify the response later
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ // Create new response to apply cookie changes
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if expired - important!
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin_area')) {
    if (!user) {
      // No user, redirect to login
      console.log('Middleware: No user session found for /admin_area, redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // TODO: Add role check if needed, similar to validateAdminSession
    // This might involve fetching user metadata or querying the 'User' table
    // Example: Fetch role from metadata (if you store it there)
    // if (user?.user_metadata?.role !== 'ADMIN') {
    //   console.log('Middleware: User does not have ADMIN role, redirecting.');
    //   // Redirect to a 'forbidden' page or homepage
    //   return NextResponse.redirect(new URL('/', request.url));
    // }

    console.log(`Middleware: Valid session for user ${user.id} accessing ${pathname}`);
  }

  // Redirect logged-in users away from login page
  if (user && pathname === '/login') {
    console.log('Middleware: User already logged in, redirecting from /login to /admin_area/dashboard');
    return NextResponse.redirect(new URL('/admin_area/dashboard', request.url))
  }


  // Return the response object to apply cookie updates
  return response
}

// Configuratie om de middleware op de juiste paden uit te voeren
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)', // Apply to most paths except static assets and API routes
    // Explicitly include paths needing protection or redirection logic
    '/admin_area/:path*',
    '/login',
  ],
} 