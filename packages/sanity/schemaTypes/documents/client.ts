// packages/sanity/schemaTypes/documents/client.ts
import {UsersIcon} from '@sanity/icons'
import {defineType} from 'sanity'

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  icon: UsersIcon,
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
      options: {
        hotspot: true,
      },
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
