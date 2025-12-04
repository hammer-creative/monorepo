// schemaTypes/documents/homePage.ts

import {defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    {
      name: 'modules',
      title: 'Content Modules',
      type: 'array',
      of: [{type: 'caseStudyCardModule'}, {type: 'textModule'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      modules: 'modules',
    },
    prepare({title, modules}) {
      const moduleCount = modules?.length || 0
      return {
        title: title || 'hammercreative.com',
        subtitle: `${moduleCount} module${moduleCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
