// schemaTypes/modules/heroModule.ts

// schemaTypes/modules/heroModule.ts

import {defineType} from 'sanity'
import {createTextField} from '../factories/textFieldFactory'
import {createPortableTextField} from '../factories/portableTextFactory'
import {createColorField} from '../factories/colorFieldFactory'

export const heroModule = defineType({
  name: 'heroModule',
  title: 'Hero Module',
  type: 'object',
  icon: () => '🎯',
  fields: [
    createTextField({
      name: 'heading',
      title: 'Heading',
      required: true,
      maxLength: 80,
    }),
    createPortableTextField({
      name: 'description',
      title: 'Description',
      required: true,
      maxLength: 500,
    }),
    createColorField({
      name: 'backgroundColor',
      title: 'Background Color',
      required: true,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      backgroundColor: 'backgroundColor',
    },
    prepare({title, backgroundColor}) {
      return {
        title: title || 'Hero Module',
        subtitle: backgroundColor?.enabled ? `Background: ${backgroundColor.color}` : 'Hero',
      }
    },
  },
})
