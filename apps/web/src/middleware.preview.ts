// middleware.preview.ts
// Per-person login for the `preview` branch deploy. Next only picks this file up as middleware when
// `pageExtensions` includes `preview.ts`, which next.config.ts sets for the preview site alone, so
// production builds have no middleware at all. See lib/preview-auth.ts for how access works.
import { clerkClient, clerkMiddleware } from '@clerk/nextjs/server';
import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';
import { isAllowedEmail, STUDIO_COOKIE, verifyStudioCookie } from '@/lib/preview-auth';

// `/api/enable-draft` checks Sanity's preview secret itself and sets the Studio cookie on success.
// robots.txt stays readable so crawlers see the disallow-all.
const PUBLIC_PATHS = new Set(['/api/enable-draft', '/robots.txt']);

const clerk = clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn({ returnBackUrl: req.url });

  // Fast path: add `"email": "{{user.primary_email_address}}"` to the Clerk session token
  // (Dashboard → Sessions → Customize session token). Otherwise look the user up.
  let email = typeof sessionClaims?.email === 'string' ? sessionClaims.email : undefined;
  if (!email) {
    const user = await (await clerkClient()).users.getUser(userId);
    email = user.primaryEmailAddress?.emailAddress;
  }
  if (isAllowedEmail(email)) return NextResponse.next();

  return new NextResponse(
    `<!doctype html><meta name="robots" content="noindex"><title>No access</title>
<p style="font-family:system-ui;margin:3rem">${escapeHtml(email ?? 'This account')} doesn't have access to the preview site. Ask an admin to add you.</p>`,
    {
      status: 403,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    }
  );
});

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (PUBLIC_PATHS.has(req.nextUrl.pathname)) return NextResponse.next();
  if (await verifyStudioCookie(req.cookies.get(STUDIO_COOKIE)?.value)) return NextResponse.next();
  return clerk(req, event);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export const config = {
  matcher: [
    // Everything except Next internals and static files (Clerk's recommended matcher)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|glb|gltf|hdr|mp4|webm)).*)',
    '/(api|trpc)(.*)',
  ],
};
