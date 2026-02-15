// apps/web/src/lib/sanity/imageLoader.ts
import imageUrlBuilder from '@sanity/image-url';
import { createClient } from 'next-sanity';

const imageClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(imageClient);

export default function sanityLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return builder
    .image(src)
    .width(width)
    .quality(quality || 90) // Match component default
    .dpr(2)
    .fit('max')
    .auto('format') // Sanity picks best format (WebP/AVIF)
    .url();
}
