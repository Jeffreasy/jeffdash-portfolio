import { createServerClient, type CookieOptions } from '@supabase/ssr' // Importeer ssr helper
import { NextResponse, type NextRequest } from 'next/server'

// Noot: De Supabase client initialisatie wordt nu binnen de middleware gedaan
// met request/response objecten, niet via de helpers uit /lib/supabase.

// Helper function to check under construction status
async function getUnderConstructionStatus(supabase: any): Promise<boolean> {
  // In development mode, prioritize environment variable over database
  if (process.env.NODE_ENV === 'development') {
    const envStatus = process.env.UNDER_CONSTRUCTION === 'true';
    if (process.env.UNDER_CONSTRUCTION !== undefined) {
      console.log(`Development mode: Using environment variable UNDER_CONSTRUCTION=${process.env.UNDER_CONSTRUCTION}`);
      return envStatus;
    }
  }

  try {
    // First try to get from database
    const { data: setting, error } = await supabase
      .from('SiteSettings')
      .select('value')
      .eq('key', 'under_construction')
      .single();

    if (!error && setting) {
      return setting.value === 'true';
    }
  } catch (error) {
    console.log('Database check failed, falling back to environment variable');
  }

  // Fallback to environment variable
  return process.env.UNDER_CONSTRUCTION === 'true';
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const { pathname } = request.nextUrl

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

  // Check for under construction mode (database first, then environment)
  const isUnderConstruction = await getUnderConstructionStatus(supabase);
  
  // Routes that should be accessible even during maintenance
  const allowedRoutes = [
    '/under-construction',
    '/admin_area',
    '/login',
    '/api',
    '/_next',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.json',
    '/icon.png',
    '/apple-icon.png',
    '/logo.png',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/apple-touch-icon.png',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/.well-known'
  ]
  
  // Public routes that should be blocked during maintenance
  const blockedPublicRoutes = [
    '/about',
    '/projects', 
    '/blog',
    '/contact',
    '/test-auth'
  ]
  
  // Check if current path should be allowed during maintenance
  const isAllowedRoute = allowedRoutes.some(route => pathname.startsWith(route))
  const isBlockedPublicRoute = blockedPublicRoutes.some(route => pathname.startsWith(route))
  
  // Redirect to under construction page if maintenance mode is enabled
  if (isUnderConstruction && (!isAllowedRoute || isBlockedPublicRoute)) {
    // Don't redirect if already on under construction page to prevent loops
    if (pathname !== '/under-construction') {
      console.log(`Middleware: Under construction mode - redirecting ${pathname} to /under-construction`);
      return NextResponse.redirect(new URL('/under-construction', request.url))
    }
  }

  // Refresh session if expired - important!
  const { data: { user } } = await supabase.auth.getUser()

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
     * - Static assets (images, icons, etc.)
     * - API routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon|logo|android-chrome|apple-touch-icon|manifest|api/).*)',
    // Explicitly include paths needing protection or redirection logic
    '/admin_area/:path*',
    '/login',
  ],
} 