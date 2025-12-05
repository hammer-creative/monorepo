// packages/sanity/schemaTypes/documents/client.ts
import {CaseIcon} from '@sanity/icons'
import {defineType} from 'sanity'

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  icon: CaseIcon,
  fields: [
    {
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Client Logo',
      type: 'image',
    },
    {
      name: 'website',
      title: 'Website',
      type: 'url',
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})
