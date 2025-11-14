// schemaTypes/modules/heroModule.ts

// schemaTypes/modules/heroModule.ts

import {StarIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createClientField, createSingleImageField, createColorField} from '../factories'

export const heroModule = defineType({
  name: 'heroModule',
  title: 'Hero Module',
  type: 'object',
  icon: StarIcon,
  fields: [
    createClientField({
      name: 'client',
      title: 'Client',
      required: true,
    }),
    titleField(),
    portableTextField(),
    createSingleImageField({
      name: 'image',
      title: 'Hero Image',
      required: true,
      minWidth: 1920,
      minHeight: 1080,
      maxFileSize: 5,
      description: 'Main hero image. Minimum 1920x1080px, maximum 5MB.',
      imageOptions: {
        hotspot: {
          previews: [
            {title: '16:9 Landscape', aspectRatio: 16 / 9},
            {title: '21:9 Ultrawide', aspectRatio: 21 / 9},
          ],
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
