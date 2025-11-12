// packages/sanity/schemaTypes/objects/textBlock.ts

import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [titleField(), portableTextField()],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title || 'Text Block',
      }
    },
  },
})
