import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Gebruik jose voor edge runtime compatibiliteit

const SESSION_COOKIE_NAME = 'session'; // Zelfde naam als gebruikt bij inloggen

// Definieer de JWT payload structuur (zonder 'role' voor nu, afhankelijk van wat in je token zit)
interface JwtPayload {
  userId: string;
  // Voeg hier eventueel 'role' toe als die in je JWT zit en je die wilt checken
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

async function verifyAuth(token: string): Promise<JwtPayload | null> {
  if (!process.env.JWT_SECRET) {
    console.error('Middleware: FATAL ERROR: JWT_SECRET is niet ingesteld!');
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify<JwtPayload>(token, secret);
    // console.log('Middleware: Token geverifieerd, payload:', payload); // Debug log (optioneel)

    // Hier kun je eventueel de 'role' checken als die in de payload zit
    // if (payload.role !== 'ADMIN') {
    //   console.log('Middleware: Gebruiker heeft geen ADMIN rol.');
    //   return null;
    // }

    return payload;
  } catch (err) {
    console.error('Middleware: Sessie validatie gefaald:', err instanceof Error ? err.message : err);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // Logica alleen toepassen op admin paden (dubbelcheck via code, matcher is primair)
  if (pathname.startsWith('/admin_area')) {
    if (!token) {
      console.log('Middleware: Geen sessie token gevonden voor admin route, redirect naar /login');
      const loginUrl = new URL('/login', request.url);
      // Voeg eventueel een 'redirectedFrom' query param toe
      // loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const verifiedPayload = await verifyAuth(token);

    if (!verifiedPayload) {
      console.log('Middleware: Ongeldige sessie token voor admin route, redirect naar /login');
      // Optioneel: Verwijder de ongeldige cookie
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    // Gebruiker is geauthenticeerd voor de admin route
    // console.log(`Middleware: Geldige sessie voor gebruiker ${verifiedPayload.userId} op ${pathname}`);
  }

  // Ga door naar de volgende middleware of de gevraagde route
  return NextResponse.next();
}

// Configuratie om de middleware alleen op specifieke paden uit te voeren
export const config = {
  matcher: [
    /*
     * Match alle request paden behalve die starten met:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (de login pagina zelf)
     * - Pas de admin route prefix hieronder aan indien nodig!
     */
    // '/((?!api|_next/static|_next/image|favicon.ico|login).*)', // Oude matcher (te breed)
     '/admin_area/:path*', // Specifiek voor admin routes
  ],
}; 