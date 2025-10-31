// packages/sanity/schemaTypes/objects/seo.ts

import {defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title for SEO purposes',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A brief description for SEO purposes',
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Keywords relevant to the content for SEO purposes',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'An image for SEO purposes (e.g., social sharing)',
    },
  ],
})
