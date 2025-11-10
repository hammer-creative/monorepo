// packages/sanity/schemaTypes/modules/textImageModule.ts

import {ImageIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createTextField} from '../factories/textFieldFactory'
import {createPortableTextField} from '../factories/portableTextFactory'
import {createSingleImageField} from '../factories/imageFieldFactory'
import {createColorField} from '../factories/colorFieldFactory'

export const textImageModule = defineType({
  name: 'textImageModule',
  title: 'Text + Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    createTextField({
      name: 'title',
      title: 'Heading',
      required: true,
      maxLength: 100,
    }),
    createPortableTextField({
      name: 'bodyText',
      title: 'Body Text',
      required: true,
      maxLength: 600,
    }),
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
  ],
  preview: {
    select: {
      title: 'heading',
      backgroundColor: 'backgroundColor',
    },
    prepare({title, backgroundColor}) {
      return {
        title: title || 'Text + Image Module',
        subtitle: backgroundColor?.enabled ? `Background: ${backgroundColor.name}` : 'Hero',
      }
    },
  },
})
