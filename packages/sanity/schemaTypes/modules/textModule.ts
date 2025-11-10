// packages/sanity/schemaTypes/modules/textModule.ts

import {TextIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createTextField} from '../factories/textFieldFactory'
import {createPortableTextField} from '../factories/portableTextFactory'
import {createColorField} from '../factories/colorFieldFactory'

export const textModule = defineType({
  name: 'textModule',
  title: 'Text',
  type: 'object',
  icon: TextIcon,
  fields: [
    createTextField({
      name: 'title',
      title: 'Headline',
      required: true,
      maxLength: 100,
    }),
    createTextField({
      name: 'tag',
      title: 'Tag',
      required: true,
      maxLength: 100,
    }),
    createPortableTextField({
      name: 'bodyText',
      title: 'Body Text',
      required: true,
      maxLength: 600,
    }),
    createColorField({
      name: 'backgroundColor',
      title: 'Background Color',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      backgroundColor: 'backgroundColor',
    },
    prepare({title, backgroundColor}) {
      return {
        title: title || 'Text Module',
        subtitle: backgroundColor?.enabled ? `Background: ${backgroundColor.name}` : 'Hero',
      }
    },
  },
})
