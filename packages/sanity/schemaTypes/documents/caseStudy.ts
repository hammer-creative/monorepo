// schemaTypes/documents/caseStudy.ts

import {defineType} from 'sanity'
import {titleField, slugField} from '../fields'

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    titleField,
    slugField,
    {
      name: 'modules',
      title: 'Content Modules',
      type: 'array',
      of: [{type: 'heroModule'}, {type: 'singleVideoModule'}, {type: 'multiVideoModule'}],
      validation: (Rule) =>
        Rule.custom((modules) => {
          if (!modules) return true

          const heroCount = modules.filter((module: any) => module._type === 'heroModule').length

          if (heroCount > 1) {
            return 'Only one Hero Module is allowed per case study'
          }

          return true
        }),
    },
  ],
  preview: {
    select: {
      title: 'title',
      modules: 'modules',
    },
    prepare({title, modules}) {
      return {
        title: title || 'Untitled',
        subtitle: `${modules?.length || 0} modules`,
      }
    },
  },
})
