// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schema} from './schemaTypes'
import {muxInput} from 'sanity-plugin-mux-input'

export default defineConfig({
  name: 'hammer-creative-sanity-studio',
  title: 'Hammer Creative Sanity Studio',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [
    structureTool(),
    visionTool(),
    muxInput({
      mp4_support: 'standard',
    }),
  ],

  schema, // Register all schema types
})

// console.log('Mux Token ID:', process.env.SANITY_STUDIO_MUX_TOKEN_ID)
// console.log('Mux Token Secret:', process.env.SANITY_STUDIO_MUX_TOKEN_SECRET)
