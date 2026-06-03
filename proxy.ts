import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  /*
    Be careful when protecting pages. The server gets the user 
    session from the cookies, which can be spoofed by anyone.

    Always use supabase.auth.getClaims() to protect pages and 
    user data.

    Never trust supabase.auth.getSession() inside server code 
    such as Proxy. It isn't guaranteed to revalidate the Auth token.

    It's safe to trust getClaims() because it validates the JWT 
    signature against the project's published public keys every time.
  */
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}