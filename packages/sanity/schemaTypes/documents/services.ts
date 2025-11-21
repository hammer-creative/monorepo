// schemaTypes/documents/caseStudy.ts

import {defineType} from 'sanity'
import {titleField, slugField} from '../fields/textField'
import {ModulesArrayInput} from '../components/ModulesArrayInput'

export const servicesPage = defineType({
  name: 'sercicesPace',
  title: 'Services Page',
  type: 'document',
  fields: [
    titleField(), // ✅ now a function call
    slugField(), // ✅ now a function call
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'service'}]}],
    },
    {
      name: 'modules',
      title: 'Content Modules',
      type: 'array',
      components: {input: ModulesArrayInput},
      of: [
        {type: 'heroModule'},
        {type: 'servicesModule'},
        {type: 'textImageModule'},
        {type: 'textModule'},
        {type: 'singleImageModule'},
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((modules: any[] | undefined) => {
            if (!modules || modules.length === 0) {
              return 'At least one module is required'
            }

            const heroCount = modules.filter((m) => m._type === 'heroModule').length

            if (heroCount === 0) {
              return 'Exactly one Hero Module is required'
            }

            if (heroCount > 1) {
              return 'Only one Hero Module is allowed'
            }

            if (modules[0]._type !== 'heroModule') {
              return 'Hero Module must be the first module'
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
      const moduleCount = modules?.length || 0
      return {
        title: title || 'Untitled',
        subtitle: `${moduleCount} module${moduleCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
