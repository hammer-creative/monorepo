// apps/packages/sanity/schemaTypes/modules/singleImageModule.ts

import {ImageIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createTextField} from '../factories/textFieldFactory'
import {createPortableTextField} from '../factories/portableTextFactory'
import {createSingleImageField} from '../factories/imageFieldFactory'
import {createColorField} from '../factories/colorFieldFactory'

/**
 * Single Image Module
 * Displays one hero image with optional caption and description
 *
 * Use cases:
 * - Featured images
 * - Full-width hero images
 * - Standalone visuals
 * - Portfolio pieces
 */
export const singleImageModule = defineType({
  name: 'singleImageModule',
  title: 'Single Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    createTextField({
      name: 'title',
      title: 'Title',
      required: true,
      maxLength: 100,
    }),
    createSingleImageField({
      name: 'image',
      title: 'Image',
      required: true,
      withCaption: true,
    }),
    createPortableTextField({
      name: 'description',
      title: 'Description',
      maxLength: 500,
    }),
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Full Width', value: 'fullWidth'},
          {title: 'Contained', value: 'contained'},
          {title: 'Wide', value: 'wide'},
        ],
        layout: 'radio',
      },
      initialValue: 'contained',
      description: 'How the image should be displayed on the page',
    },
    createColorField({
      name: 'backgroundColor',
      title: 'Background Color',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      layout: 'layout',
    },
    prepare({title, media, layout}) {
      return {
        title: title || 'Untitled',
        subtitle: `Single Image Module • ${layout || 'contained'}`,
        media,
      }
    },
  },
})
