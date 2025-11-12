// packages/sanity/schemaTypes/documents/service.ts

import {CaseIcon} from '@sanity/icons'
import {defineType} from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: CaseIcon,
  fields: [
    {
      name: 'name',
      title: 'Service Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
