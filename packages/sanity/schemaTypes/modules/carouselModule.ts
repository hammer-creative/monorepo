// packages/sanity/schemaTypes/modules/multiImageModule.ts

import {ImageIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createMultiImageField, createColorField} from '../factories'

/**
 * Multi Image Module
 * Image carousel supporting 3+ images
 */
export const carouselModule = defineType({
  name: 'carouselModule',
  title: 'Carousel Module',
  type: 'object',
  icon: ImageIcon,
  fields: [
    createMultiImageField({
      name: 'images',
      title: 'Images',
      required: true,
      minImages: 3,
    }),
    createColorField({
      name: 'backgroundColor',
      title: 'Background Color',
      required: true,
    }),
  ],
  preview: {
    select: {
      images: 'images',
      backgroundColor: 'backgroundColor',
    },
    prepare({images, backgroundColor}) {
      const count = images?.length || 0
      return {
        title: `${count} Image${count !== 1 ? 's' : ''}`,
        subtitle: backgroundColor?.enabled ? `BG: ${backgroundColor.name}` : undefined,
        media: images?.[0]?.image,
      }
    },
  },
})
