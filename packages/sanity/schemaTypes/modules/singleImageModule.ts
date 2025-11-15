// packages/sanity/schemaTypes/modules/singleImageModule.ts

import {ImageIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createSingleImageField, createColorField} from '../factories'

/**
 * Single Image Module
 * Displays one hero image with optional caption and description
 */
export const singleImageModule = defineType({
  name: 'singleImageModule',
  title: 'Single Image Module',
  type: 'object',
  icon: ImageIcon,
  fields: [
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
      media: 'image',
      backgroundColor: 'backgroundColor',
    },
    prepare({media, backgroundColor}) {
      return {
        title: 'Single Image Module',
        subtitle: backgroundColor?.enabled ? backgroundColor.name : undefined,
        media,
      }
    },
  },
})
