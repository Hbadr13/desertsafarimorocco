import { NextResponse } from "next/server"

export function middleware(request: any) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/desert26safariadmin/login") || pathname.startsWith("/desert26safariadmin/forgot-password") || pathname.startsWith("/desert26safariadmin/reset-password")) {
    return NextResponse.next()
  }

  const token = request.cookies.get("auth-token")?.value
  if (!token) {
    return NextResponse.redirect(new URL("/desert26safariadmin/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/desert26safariadmin/:path*"],
}
