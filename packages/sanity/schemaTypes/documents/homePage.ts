// schemaTypes/documents/homePage.ts

import {defineType} from 'sanity'
import {titleField, slugField} from '../fields/textField'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    {
      name: 'modules',
      title: 'Content Modules',
      type: 'array',
      of: [{type: 'caseStudyCardModule'}],
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
        title: title || 'Untitled',
        subtitle: `${moduleCount} module${moduleCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
