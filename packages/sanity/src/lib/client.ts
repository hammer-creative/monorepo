// packages/sanity/lib/sanity/client.ts
import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: '5a2vlo6p',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})
