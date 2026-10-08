// apps/web/src/app/api/preview-status/route.ts
// TEMPORARY diagnostic for the preview site: reports config flags and whether a draft-only slug
// resolves. Never returns the token. Delete once preview is confirmed working.
import { NextResponse } from 'next/server';
import { getSanityClient } from '@/lib/sanity/server';

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('slug') ?? '';
  const client = await getSanityClient();
  const found = slug
    ? await client.fetch<{ _id: string } | null>(
        `*[_type == "caseStudy" && slug.current == $slug][0]{ _id }`,
        { slug },
        { cache: 'no-store' }
      )
    : null;

  return NextResponse.json({
    previewFlag: process.env.NEXT_PUBLIC_SANITY_PREVIEW_SITE ?? null,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? null,
    tokenPresent: Boolean(process.env.SANITY_API_PREVIEW_TOKEN),
    perspective: client.config().perspective,
    slug,
    found: Boolean(found),
  });
}
