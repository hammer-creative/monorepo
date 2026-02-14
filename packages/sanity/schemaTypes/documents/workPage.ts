// schemaTypes/documents/workPage.ts

import {defineType} from 'sanity'
import {titleField, slugField} from '../fields/textField'

export const workPage = defineType({
  name: 'workPage',
  title: 'Work Page',
  type: 'document',
  fields: [
    titleField(),
    slugField(),
    {
      name: 'modules',
      title: 'Case S',
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
        title: title || 'Untitled',
        subtitle: `${moduleCount} module${moduleCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
