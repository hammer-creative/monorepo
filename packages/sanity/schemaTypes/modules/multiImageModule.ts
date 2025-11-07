// packages/sanity/schemaTypes/modules/multiImageModule.ts

import {ImageIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createTextField} from '../factories/textFieldFactory'
import {createMultiImageField} from '../factories/imageFieldFactory'
import {createColorField} from '../factories/colorFieldFactory'

/**
 * Multi Image Module
 * Displays 2-6 images in a configurable grid layout
 *
 * Use cases:
 * - Image galleries
 * - Product showcases
 * - Before/after comparisons
 * - Process steps with visuals
 * - Portfolio grids
 */
export const multiImageModule = defineType({
  name: 'multiImageModule',
  title: 'Multi Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    createTextField({
      name: 'title',
      title: 'Title',
      required: true,
      maxLength: 100,
    }),
    createMultiImageField({
      name: 'imageItems',
      title: 'Images',
      required: true,
      minImages: 2,
      maxImages: 6,
    }),
    {
      name: 'gridLayout',
      title: 'Grid Layout',
      type: 'string',
      options: {
        list: [
          {title: '2 Columns', value: 'cols-2'},
          {title: '3 Columns', value: 'cols-3'},
          {title: 'Masonry', value: 'masonry'},
        ],
        layout: 'radio',
      },
      initialValue: 'cols-2',
      description: 'Choose how images are arranged in the grid',
    },
    createColorField({
      name: 'backgroundColor',
      title: 'Background Color',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      images: 'imageItems',
      gridLayout: 'gridLayout',
    },
    prepare({title, images, gridLayout}) {
      const imageCount = images?.length || 0
      const layoutLabel =
        gridLayout === 'masonry' ? 'Masonry' : gridLayout?.replace('cols-', '') + ' cols'
      return {
        title: title || 'Untitled',
        subtitle: `Multi Image Module • ${imageCount} images • ${layoutLabel}`,
        media: images?.[0]?.image,
      }
    },
  },
})
