// packages/sanity/sanity.config.ts

import { table } from '@sanity/table';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { defineDocuments, defineLocations, presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { media } from 'sanity-plugin-media';
import { muxInput } from 'sanity-plugin-mux-input';
import { schema } from './schemaTypes';

export default defineConfig({
  name: 'hammer-creative-sanity-studio',
  title: 'Hammer Creative Sanity Studio',
  projectId: `n0pp6em3`,
  dataset: `production`,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Pages')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    S.documentTypeListItem('caseStudy').title('Case Studies'),
                    S.documentTypeListItem('basicPage').title('Basic Page'),
                    S.documentTypeListItem('homePage').title('Home Page'),
                    S.documentTypeListItem('servicesPage').title('Services Page'),
                    S.documentTypeListItem('workPage').title('Work Page'),
                  ])
              ),
            S.divider(),
            S.listItem()
              .title('Vocabularies')
              .child(
                S.list()
                  .title('Vocabularies')
                  .items([
                    S.documentTypeListItem('client').title('Clients'),
                    S.documentTypeListItem('deliverable').title('Deliverables'),
                    S.documentTypeListItem('service').title('Services'),
                  ])
              ),
          ]),
    }),
    visionTool(),
    muxInput({
      mp4_support: 'standard',
    }),
    media(),
    table(),
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
            route: '/services',
            filter: `_type == "servicesPage"`,
          },
          {
            route: '/work',
            filter: `_type == "workPage"`,
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
          servicesPage: defineLocations({
            select: { title: 'title' },
            resolve: () => ({ locations: [{ title: 'Services', href: '/services' }] }),
          }),
          workPage: defineLocations({
            select: { title: 'title' },
            resolve: () => ({ locations: [{ title: 'Work', href: '/work' }] }),
          }),
          caseStudy: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => {
              if (!doc?.slug) return { locations: [] };

              return {
                locations: [
                  {
                    title: doc.title || 'Untitled',
                    href: `/work/${doc.slug}`,
                  },
                ],
              };
            },
          }),
        },
      },
    }),
  ],

  schema,
  form: {
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter((assetSource) => assetSource.name !== 'sanity-default');
      },
    },
  },
});
