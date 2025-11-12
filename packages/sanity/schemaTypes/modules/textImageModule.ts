// packages/sanity/schemaTypes/modules/textImageModule.ts

import {ImageIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createSingleImageField, createColorField} from '../factories'

export const textImageModule = defineType({
  name: 'textImageModule',
  title: 'Text + Image Module',
  type: 'object',
  icon: ImageIcon,
  fields: [
    titleField(),
    portableTextField(),
    createSingleImageField({
      name: 'image',
      title: 'Image',
      required: true,
    }),
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
      media: 'image',
      backgroundColor: 'backgroundColor',
    },
    prepare({title, media, backgroundColor}) {
      return {
        title: title || 'Text + Image Module',
        subtitle: backgroundColor?.enabled ? `BG: ${backgroundColor.name}` : undefined,
        media,
      }
    },
  },
})
