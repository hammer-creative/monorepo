// apps/web/src/app/api/enable-draft/route.ts
import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { client } from '@/lib/sanity/client';

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    ...(process.env.SANITY_API_PREVIEW_TOKEN && { token: process.env.SANITY_API_PREVIEW_TOKEN }),
  }),
});
