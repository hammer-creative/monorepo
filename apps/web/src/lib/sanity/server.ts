// lib/sanity/server.ts
// Server-only: reads the Viewer token and `draftMode()`. Never import from a client component.
import { draftMode } from 'next/headers';
import { connection } from 'next/server';
import type { SanityClient } from 'next-sanity';
import { client, studioUrl } from './client';

export const draftClient = client.withConfig({
  ...(process.env.SANITY_API_PREVIEW_TOKEN && { token: process.env.SANITY_API_PREVIEW_TOKEN }),
  perspective: 'drafts',
  stega: { enabled: true, studioUrl },
});

// NEXT_PUBLIC_SANITY_PREVIEW_SITE=true is set only for the `preview` branch deploy (see netlify.toml). It is
// ignored on production builds so the live site can never serve drafts.
export const isPreviewSite =
  process.env.NEXT_PUBLIC_SANITY_PREVIEW_SITE === 'true' &&
  process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production';

/**
 * Picks the Sanity client for this request. Call from server components and `generateMetadata`;
 * pass the result to the `getX(client)` queries.
 * - Studio Presentation (Next.js draft mode on): drafts, stega on, for click-to-edit.
 * - Preview site (`NEXT_PUBLIC_SANITY_PREVIEW_SITE`): drafts on every request with stega on, so the
 *   click-to-edit outlines work on direct visits, no draft-mode cookie needed.
 * - Otherwise: the published client.
 */
export async function getSanityClient(): Promise<SanityClient> {
  const { isEnabled } = await draftMode();
  if (isEnabled) return draftClient;
  if (!isPreviewSite) return client;
  // Opt this request out of static/ISR caching so every view fetches current drafts.
  await connection();
  return draftClient;
}
