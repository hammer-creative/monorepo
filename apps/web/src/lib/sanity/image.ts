// apps/web/lib/sanity/image.ts
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { createClient } from 'next-sanity';

// Create a minimal client just for image URLs with public env vars
const imageClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_STUDIO_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(imageClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
