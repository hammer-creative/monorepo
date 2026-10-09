// apps/web/src/app/docs/route.ts
// Editor guide, served as a standalone HTML page (no site layout). Only exists on the `preview`
// branch deploy (isPreviewSite); every other context, including production, gets a 404. The page has
// no env var or key names, and screenshots are inlined so nothing lives in public/. Not crawlable:
// noindex meta tag in the page, X-Robots-Tag here and in next.config.ts. The preview deploy's
// robots.txt already disallows everything.
import { notFound } from 'next/navigation';
import { isPreviewSite } from '@/lib/sanity/server';
import { docsHtml } from './html';

export function GET() {
  if (!isPreviewSite) notFound();

  return new Response(docsHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
