// lib/sanity/client.ts
import { createClient } from 'next-sanity';

const projectId = 'n0pp6em3';
const dataset = 'production';
const apiVersion = '2024-01-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_PREVIEW_TOKEN,
  stega: {
    studioUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://hammercreative-cms.sanity.studio'
        : 'http://localhost:3333',
  },
});

export const draftClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_PREVIEW_TOKEN,
  perspective: 'previewDrafts',
  stega: {
    enabled: true,
    studioUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://hammercreative-cms.sanity.studio'
        : 'http://localhost:3333/studio',
  },
});
