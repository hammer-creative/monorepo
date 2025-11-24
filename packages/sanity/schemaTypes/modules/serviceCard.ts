// packages/sanity/schemaTypes/modules/servicesCard.ts

import {defineType} from 'sanity'

import {DocumentIcon} from '@sanity/icons'
import {titleField, portableTextField} from '../fields/textField'
import {createSingleImageField} from '../factories'

export const serviceCard = defineType({
  name: 'serviceCard',
  title: 'Service Card',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    titleField(),
    portableTextField(),
    createSingleImageField({
      name: 'image',
      title: 'Hero Image',
      required: true,
      minWidth: 3840,
      minHeight: 2160,
      maxFileSize: 10,
      description: 'Minimum dimensions 3770 px × 1110 px, maximum filze size 10 MB.',
      imageOptions: {
        hotspot: {
          previews: [{title: '4:1 Landscape', aspectRatio: 94 / 27}],
        },
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      backgroundColor: 'backgroundColor',
      textColor: 'textColor',
    },
    prepare({title, backgroundColor}) {
      return {
        title: title || 'Hero Module',
        subtitle: backgroundColor?.enabled ? `Background: ${backgroundColor.name}` : 'Hero',
      }
    },
  },
})
