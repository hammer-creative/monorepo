// lib/sanity/server.ts
// Server-only: reads the Viewer token and `draftMode()`. Never import from a client component.
import { draftMode } from 'next/headers';
import type { SanityClient } from 'next-sanity';
import { client, studioUrl } from './client';

export const draftClient = client.withConfig({
  ...(process.env.SANITY_API_PREVIEW_TOKEN && { token: process.env.SANITY_API_PREVIEW_TOKEN }),
  perspective: 'drafts',
  stega: { enabled: true, studioUrl },
});

/**
 * Returns the draft client (drafts perspective, stega on, token attached) while Next.js draft
 * mode is enabled, otherwise the published client. Call from server components and
 * `generateMetadata`; pass the result to the `getX(client)` queries.
 */
export async function getSanityClient(): Promise<SanityClient> {
  const { isEnabled } = await draftMode();
  return isEnabled ? draftClient : client;
}
