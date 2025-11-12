// packages/sanity/schemaTypes/objects/imageItem.ts
// packages/sanity/schemaTypes/objects/imageItem.ts
import {defineType} from 'sanity'
import {createSingleImageField, createTextField} from '../factories'

export const imageItem = defineType({
  name: 'imageItem',
  title: 'Image Item',
  type: 'object',
  fields: [
    createSingleImageField({
      name: 'image',
      title: 'Image',
      required: true,
    }),
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
