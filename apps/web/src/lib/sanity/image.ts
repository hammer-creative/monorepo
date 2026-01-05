// apps/web/lib/sanity/image.ts
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { createClient } from 'next-sanity';

// Create a minimal client just for image URLs with public env vars
const imageClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(imageClient);

export function urlFor(source: SanityImageSource) {
  const imageBuilder = builder.image(source);

  // Check if source contains a PNG reference
  let isPng = false;

  if (typeof source === 'object' && source !== null && 'asset' in source) {
    const { asset } = source;

    if (typeof asset === 'string') {
      isPng = asset.includes('-png') || asset.endsWith('.png');
    } else if (typeof asset === 'object' && asset !== null && '_ref' in asset) {
      isPng =
        typeof asset._ref === 'string' &&
        (asset._ref.includes('-png') || asset._ref.endsWith('.png'));
    }
  }

  // For PNGs, return without any format parameter
  // For other formats, use auto format optimization
  if (isPng) {
    return imageBuilder;
  }

  return imageBuilder.auto('format');
}
