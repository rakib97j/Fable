import { NextResponse } from 'next/server'
import { auth } from './lib/auth'
import { headers } from 'next/headers'
 
// This function can be marked `async` if using `await` inside
export async function proxy(request) {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        const signinUrl = new URL('/auth/signin', request.url)
        const targetPath = request.nextUrl.pathname + request.nextUrl.search
        signinUrl.searchParams.set('callbackUrl', targetPath)
        return NextResponse.redirect(signinUrl)
    }

  
}
 
export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/api/bookmarks',
    '/api/bookmarks/:path*',
    '/api/users',
    '/api/users/:path*',
    '/e-books/:path',

  ],
}

