// packages/sanity/schemaTypes/objects/imageItem.ts

import {defineType} from 'sanity'
import {createTextField} from '../factories'

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
        createTextField({
          name: 'alt',
          title: 'Alt Text',
          required: true,
          maxLength: 150,
        }),
      ],
    },
    createTextField({
      name: 'caption',
      title: 'Caption',
      multiline: true,
      rows: 2,
      required: false,
      maxLength: 200,
      withCounter: true,
    }),
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
