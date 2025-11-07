// packages/sanity/schemaTypes/objects/imageItem.ts
import {defineType} from 'sanity'
import type {Rule} from 'sanity'

export const imageItem = defineType({
  name: 'imageItem',
  title: 'Image Item',
  type: 'object',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule: Rule) => Rule.required(),
        },
      ],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 2,
    },
  ],
  preview: {
    select: {
      media: 'image',
      alt: 'image.alt',
      caption: 'caption',
    },
    prepare({media, alt, caption}) {
      return {
        title: alt || 'Untitled Image',
        subtitle: caption,
        media: media,
      }
    },
  },
})
