// apps/web/src/app/api/enable-draft/route.ts
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { STUDIO_COOKIE, STUDIO_COOKIE_MAX_AGE, signStudioCookie } from '@/lib/preview-auth';
import { client } from '@/lib/sanity/client';
import { isPreviewSite } from '@/lib/sanity/server';

const enableDraftMode = defineEnableDraftMode({
  client: client.withConfig({
    ...(process.env.SANITY_API_PREVIEW_TOKEN && {
      token: process.env.SANITY_API_PREVIEW_TOKEN,
    }),
  }),
});

export async function GET(request: NextRequest) {
  try {
    // Returns a 401 response when Sanity's preview secret is invalid; redirects (throws) when valid.
    return await enableDraftMode.GET(request);
  } catch (error) {
    // On the preview site, a valid Studio handshake also unlocks the login gate for this iframe
    // (see lib/preview-auth.ts). Cookies set here ride along on the redirect.
    const isRedirect = String((error as { digest?: unknown })?.digest).startsWith('NEXT_REDIRECT');
    const value = isPreviewSite && isRedirect ? await signStudioCookie() : undefined;
    if (value) {
      (await cookies()).set({
        name: STUDIO_COOKIE,
        value,
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'none',
        partitioned: true,
        maxAge: STUDIO_COOKIE_MAX_AGE,
      });
    }
    throw error;
  }
}
