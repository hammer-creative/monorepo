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
