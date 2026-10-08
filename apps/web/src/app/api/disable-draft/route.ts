// apps/web/src/app/api/disable-draft/route.ts
import { draftMode } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  (await draftMode()).disable();

  const redirectTo = request.nextUrl.searchParams.get('redirect') ?? '/';
  // Only allow same-site relative redirects
  const safe = redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/';
  return NextResponse.redirect(new URL(safe, request.url));
}
