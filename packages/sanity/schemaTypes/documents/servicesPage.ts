// schemaTypes/documents/servicesPage.ts

import {defineType} from 'sanity'
import {titleField, slugField} from '../fields/textField'
import {ModulesArrayInput} from '../components/ModulesArrayInput'

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    titleField(),
    slugField(),
    {
      name: 'modules',
      title: 'Content Modules',
      type: 'array',
      components: {input: ModulesArrayInput},
      of: [{type: 'servicesPageHeroModule'}, {type: 'servicesPageCardModule'}],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((modules: any[] | undefined) => {
            if (!modules || modules.length === 0) {
              return 'At least one module is required'
            }

            const servicesPageHeroCount = modules.filter(
              (m) => m._type === 'servicesPageHeroModule',
            ).length

            if (servicesPageHeroCount === 0) {
              return 'Exactly one Hero Module is required'
            }

            if (servicesPageHeroCount > 1) {
              return 'Only one Hero Module is allowed'
            }

            if (modules[0]._type !== 'servicesPageHeroModule') {
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
