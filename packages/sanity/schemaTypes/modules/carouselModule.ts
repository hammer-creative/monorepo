// packages/sanity/schemaTypes/modules/carouselModule.ts

import {ImageIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createMultiImageField, createColorField} from '../factories'

/**
 * Carousel Module
 * Image carousel supporting 3+ square images (1:1 aspect ratio)
 * Each slide displays at 680×680px
 */
export const carouselModule = defineType({
  name: 'carouselModule',
  title: 'Carousel Module',
  type: 'object',
  icon: ImageIcon,
  fields: [
    createMultiImageField({
      name: 'images',
      title: 'Carousel Images',
      description:
        'Minimum 3 images. Each image should be square (1:1 aspect ratio), displayed at 680×680px.',
      required: true,
      minImages: 3,
      minWidth: 680,
      minHeight: 680,
      maxFileSize: 5,
      imageOptions: {
        hotspot: {
          previews: [{title: '1:1 Square', aspectRatio: 1}],
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
      images: 'images',
      backgroundColor: 'backgroundColor',
    },
    prepare({images, backgroundColor}) {
      const count = images?.length || 0
      return {
        title: `Carousel Module (${count} image${count !== 1 ? 's' : ''})`,
        subtitle: backgroundColor?.enabled ? `Background: ${backgroundColor.name}` : undefined,
        media: images?.[0]?.image,
      }
    },
  },
})
