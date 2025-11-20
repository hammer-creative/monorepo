// lib/sanity/client.ts
import { createClient } from 'next-sanity';

console.log('===== SANITY ENV CHECK =====');
console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
console.log(
  'All env keys:',
  Object.keys(process.env).filter((k) => k.includes('SANITY')),
);
console.log('===========================');

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
});
