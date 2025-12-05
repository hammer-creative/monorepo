// packages/sanity/sanity.config.ts

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool, defineDocuments, defineLocations} from 'sanity/presentation'
import {schema} from './schemaTypes'
import {muxInput} from 'sanity-plugin-mux-input'

export default defineConfig({
  name: 'hammer-creative-sanity-studio',
  title: 'Hammer Creative Sanity Studio',
  projectId: `n0pp6em3`,
  dataset: `production`,
  plugins: [
    structureTool(),
    visionTool(),
    muxInput({
      mp4_support: 'standard',
    }),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:3000',
        draftMode: {
          enable: '/api/enable-draft',
          disable: '/api/disable-draft',
        },
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: `_type == "homePage"`,
          },
          {
            route: '/work/:slug',
            filter: `_type == "caseStudy" && slug.current == $slug`,
          },
        ]),
        locations: {
          homePage: defineLocations({
            select: {
              title: 'title',
            },
            resolve: () => ({
              locations: [
                {
                  title: 'Home',
                  href: '/',
                },
              ],
            }),
          }),
          caseStudy: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => {
              if (!doc?.slug) return {locations: []}

              return {
                locations: [
                  {
                    title: doc.title || 'Untitled',
                    href: `/work/${doc.slug}`,
                  },
                ],
              }
            },
          }),
        },
      },
    }),
  ],

  schema,
})
