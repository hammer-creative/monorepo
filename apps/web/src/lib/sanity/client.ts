// lib/sanity/client.ts
import { createClient } from 'next-sanity';

const projectId = 'n0pp6em3';
const dataset = 'production';
const apiVersion = '2024-01-01';

// console.log('===== SANITY ENV CHECK =====');
// console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
// console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
// console.log(
//   'All env keys:',
//   Object.keys(process.env).filter((k) => k.includes('SANITY')),
// );

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_PREVIEW_TOKEN,
  stega: {
    studioUrl: 'http://localhost:3333', // Changed from 3000 to 3333
  },
});
