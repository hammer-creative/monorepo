// packages/sanity/sanity.config.ts

import { table } from '@sanity/table';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { defineDocuments, defineLocations, presentationTool } from 'sanity/presentation';
import { type StructureBuilder, structureTool } from 'sanity/structure';
import { media } from 'sanity-plugin-media';
import { muxInput } from 'sanity-plugin-mux-input';
import { schema } from './schemaTypes';

// Presentation always opens the always-drafts preview site (production never serves drafts), local
// or hosted. allowOrigins also permits localhost so editors can switch to a local site for testing.
// Switch to https://preview.hammercreative.com once that domain is live.
const previewUrl = 'https://preview--hammercreative.netlify.app';

// One-page document types, listed by the route they render and opened straight into the document.
const pageItem = (S: StructureBuilder, title: string, type: string, id: string) =>
  S.documentListItem().id(id).schemaType(type).title(title);

export default defineConfig({
  name: 'hammer-creative-sanity-studio',
  title: 'Hammer Creative Sanity Studio',
  projectId: `n0pp6em3`,
  dataset: `production`,
  plugins: [
    structureTool({
      structure: async (S, context) => {
        // Fetched when the Studio loads, so a new case study shows up after a refresh. Drafts and
        // published versions share a base ID; keep one entry per document. The row's title and the
        // gray last-edited subtitle come from the schema preview in caseStudyPage.ts.
        const caseStudies = await context
          .getClient({ apiVersion: '2024-01-01' })
          .fetch<{ _id: string; title?: string }[]>(
            `*[_type == "caseStudy"]{ _id, title } | order(title asc)`
          );
        const seen = new Map<string, string>();
        for (const { _id, title } of caseStudies) {
          const id = _id.replace(/^drafts\./, '');
          if (!seen.has(id) || _id.startsWith('drafts.')) seen.set(id, title || 'Untitled');
        }
        const sorted = [...seen].sort((a, b) => a[1].localeCompare(b[1]));

        return S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Static Pages')
              .child(
                S.list()
                  .title('Static Pages')
                  .items([
                    pageItem(
                      S,
                      'hammercreative.com',
                      'homePage',
                      'ba664530-1e4c-4f89-9c95-65d38844b8d4'
                    ),
                    pageItem(S, '/work', 'workPage', '56e9ea87-0014-478d-8092-01134f9495fd'),
                    pageItem(
                      S,
                      '/services',
                      'servicesPage',
                      '88cfcccb-0803-48a4-81dc-dbfd02ee76a2'
                    ),
                    pageItem(S, '/privacy', 'basicPage', '144c78fd-be36-42f8-a001-d0f06a620272'),
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
            S.divider(),
            ...sorted.map(([id]) => S.documentListItem().id(id).schemaType('caseStudy')),
          ]);
      },
    }),
    visionTool(),
    muxInput({
      mp4_support: 'standard',
    }),
    media(),
    table(),
    presentationTool({
      previewUrl: {
        initial: previewUrl,
        previewMode: {
          enable: '/api/enable-draft',
          disable: '/api/disable-draft',
        },
      },
      allowOrigins: [
        previewUrl,
        'https://preview--hammercreative.netlify.app',
        'https://preview.hammercreative.com',
        'http://localhost:*',
      ],
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
