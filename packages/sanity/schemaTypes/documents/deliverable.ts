// packages/sanity/schemaTypes/documents/deliverable.ts
import {PackageIcon} from '@sanity/icons'
import {defineType} from 'sanity'

export const deliverable = defineType({
  name: 'deliverable',
  title: 'Deliverable',
  type: 'document',
  icon: PackageIcon,
  fields: [
    {
      name: 'title',
      title: 'Deliverable Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
