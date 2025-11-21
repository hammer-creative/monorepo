// packages/sanity/schemaTypes/modules/servicesCard.ts

import {defineType} from 'sanity'

import {DocumentIcon} from '@sanity/icons'
import {titleField, portableTextField} from '../fields/textField'
import {createSingleImageField, createColorField} from '../factories'

export const servicesCard = defineType({
  name: 'servicesCard',
  title: 'Services Card',
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
      description: 'Minimum dimensions 3840 px × 2160 px, maximum filze size 10 MB.',
      imageOptions: {
        hotspot: {
          previews: [{title: '16:9 Landscape', aspectRatio: 16 / 9}],
        },
      },
    }),
    createColorField({
      name: 'backgroundColor',
      title: 'Background Color',
      required: true,
    }),
    createColorField({
      name: 'textColor',
      title: 'Text Color',
    }),
  ],
})
