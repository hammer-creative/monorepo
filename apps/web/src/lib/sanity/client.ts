// lib/sanity/client.ts
import { createClient } from 'next-sanity';

const projectId = 'n0pp6em3';
const dataset = 'production';
const apiVersion = '2024-01-01';

export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://hammercreative-cms.sanity.studio'
    : 'http://localhost:3333');

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
  stega: { studioUrl },
});
