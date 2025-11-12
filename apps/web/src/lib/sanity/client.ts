// lib/sanity/client.ts
import { createClient } from 'next-sanity';

console.log('===== SANITY ENV CHECK =====');
console.log('Project ID:', process.env.SANITY_PROJECT_ID);
console.log('Dataset:', process.env.SANITY_DATASET);
console.log(
  'All env keys:',
  Object.keys(process.env).filter((k) => k.includes('SANITY')),
);
console.log('===========================');

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
});
