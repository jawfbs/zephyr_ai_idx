import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// All routes are public — Clerk handles auth state only
// We manage role gating ourselves in the UI
const isPublicRoute = createRouteMatcher([
  '/(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Everything is public — no forced redirects
  // Clerk just makes auth state available
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
