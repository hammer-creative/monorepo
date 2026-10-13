// apps/web/src/app/api/preview-status/route.ts
// Tells the preview banner whether the page at `?path=` has unpublished changes. Returns only a
// status string, never content, and only on the preview site or in draft mode.
import { draftMode } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { isPreviewSite } from '@/lib/sanity/server';

const STATIC_PAGES: Record<string, string> = {
  '/': 'homePage',
  '/work': 'workPage',
  '/services': 'servicesPage',
};

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { isEnabled } = await draftMode();
  if (!isPreviewSite && !isEnabled) return new NextResponse(null, { status: 404 });

  const path = (request.nextUrl.searchParams.get('path') ?? '/').replace(/(.)\/$/, '$1');
  const caseStudySlug = path.startsWith('/work/') ? path.slice('/work/'.length) : null;
  const type = caseStudySlug ? 'caseStudy' : STATIC_PAGES[path];
  if (!type) return NextResponse.json({ status: 'other' });

  // `raw` returns both `drafts.<id>` and `<id>`, so we can tell whether a draft exists.
  const ids = await client
    .withConfig({
      perspective: 'raw',
      stega: false,
      useCdn: false,
      ...(process.env.SANITY_API_PREVIEW_TOKEN && { token: process.env.SANITY_API_PREVIEW_TOKEN }),
    })
    .fetch<string[]>(
      `*[_type == $type && (!defined($slug) || slug.current == $slug)]._id`,
      { type, slug: caseStudySlug },
      { cache: 'no-store' }
    );

  const hasDraft = ids.some((id) => id.startsWith('drafts.'));
  return NextResponse.json(
    { status: hasDraft ? 'draft' : 'published' },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
