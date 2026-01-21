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
