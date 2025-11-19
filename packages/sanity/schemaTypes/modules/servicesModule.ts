// packages/sanity/schemaTypes/modules/servicesModule.ts

import {CaseIcon} from '@sanity/icons'
import {defineType} from 'sanity'

export const servicesModule = defineType({
  name: 'servicesModule',
  title: 'Services Module',
  type: 'object',
  icon: CaseIcon,
  fields: [
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'service'}]}],
      validation: (Rule) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      services: 'services',
    },
    prepare({services}) {
      const serviceCount = services?.length || 0

      return {
        title: 'Services Module',
        subtitle: [`${serviceCount} service${serviceCount !== 1 ? 's' : ''}`]
          .filter(Boolean)
          .join(' • '),
      }
    },
  },
})
