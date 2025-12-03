// packages/sanity/schemaTypes/modules/servicesPageHeroModule.ts

import {AsteriskIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createSingleImageField, createColorField} from '../factories'

export const servicesPageHeroModule = defineType({
  name: 'servicesPageHeroModule',
  title: 'Services Page Hero Module',
  type: 'object',
  icon: AsteriskIcon,
  fields: [
    titleField(),
    portableTextField({maxLength: 300}),
    createSingleImageField({
      name: 'image',
      title: 'Hero Image',
      required: true,
      minWidth: 3840,
      minHeight: 2160,
      maxFileSize: 10,
      description: 'Minimum dimensions 3840 px × 2160 px, maximum file size 10 MB.',
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
      backgroundColor: 'backgroundColor',
    },
    prepare({title, backgroundColor}) {
      return {
        title: title || 'Hero Module',
        subtitle: backgroundColor?.enabled ? `Background: ${backgroundColor.name}` : 'Hero',
      }
    },
  },
})
