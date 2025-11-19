// packages/sanity/lib/sanity/client.ts
import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: 'n0pp6em3',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})
