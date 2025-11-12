// packages/sanity/schemaTypes/modules/textModule.ts

import {TextIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createTextField, createColorField} from '../factories'

export const textModule = defineType({
  name: 'textModule',
  title: 'Text Module',
  type: 'object',
  icon: TextIcon,
  fields: [
    createTextField({
      name: 'tag',
      title: 'Tag',
      required: true,
      maxLength: 50,
    }),
    titleField(),
    portableTextField(),
    createColorField({
      name: 'backgroundColor',
      title: 'Background Color',
      required: true,
    }),
    createColorField({
      name: 'textColor',
      title: 'Text Color',
      required: true,
      initialValue: {
        enabled: true,
        name: 'nightshade',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      tag: 'tag',
      backgroundColor: 'backgroundColor',
    },
    prepare({title, tag, backgroundColor}) {
      return {
        title: title || 'Text Module',
        subtitle: [tag, backgroundColor?.enabled ? `BG: ${backgroundColor.name}` : null]
          .filter(Boolean)
          .join(' • '),
      }
    },
  },
})
