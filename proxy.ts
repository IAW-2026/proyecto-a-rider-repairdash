import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(["/sing-in(.*)", "/sing-up(.*)", "/","/api(.*)"])

const USER_CLEAN_ROUTES = new Set([
  "menu",
  "profile",
  "travels",
  "promotions",
  "solicitudTrabajoActual",
  "solicitudNuevaUbicacion",
])

function setUserIdCookie(res: NextResponse, userId: string) {
  res.cookies.set("rd_user_id", userId, {
    path: "/",
    maxAge: 1800,
    sameSite: "lax",
  })
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl
  const segments = pathname.split("/").filter(Boolean)

  if (segments[0] === "user" && segments[1]) {
    const second = segments[1]

    if (/^\d+$/.test(second)) {
      const rest = segments.slice(2)
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = rest.length ? `/user/${rest.join("/")}` : "/user/menu"
      const res = NextResponse.redirect(redirectUrl, 308)
      setUserIdCookie(res, second)
      return res
    }

    if (USER_CLEAN_ROUTES.has(second)) {
      const queryId = req.nextUrl.searchParams.get("id")
      if (queryId) {
        const cleanUrl = req.nextUrl.clone()
        cleanUrl.searchParams.delete("id")
        const res = NextResponse.redirect(cleanUrl, 308)
        setUserIdCookie(res, queryId)
        return res
      }

      const cookieId = req.cookies.get("rd_user_id")?.value
      if (cookieId) {
        const rest = segments.slice(2)
        const rewriteUrl = req.nextUrl.clone()
        rewriteUrl.pathname = `/user/${cookieId}/${second}${rest.length ? `/${rest.join("/")}` : ""}`
        return NextResponse.rewrite(rewriteUrl)
      }
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/(.*)',
  ],
}