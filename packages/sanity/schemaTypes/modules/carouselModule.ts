// packages/sanity/schemaTypes/modules/carouselModule.ts

import {VersionsIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createMultiImageField, createColorField} from '../factories'
import {createImageDimensionValidation, applyRequired} from '../utils/validation'

/**
 * Carousel Module
 * Image carousel supporting 3+ square images (1:1 aspect ratio)
 * Each slide displays at 680×680px
 */
export const carouselModule = defineType({
  name: 'carouselModule',
  title: 'Image Carousel',
  type: 'object',
  icon: VersionsIcon,
  fields: [
    (() => {
      const {validation: _, ...field} = createMultiImageField({
        name: 'images',
        title: 'Images',
        description:
          'Minimum 3 images. Each image should be square (1:1 aspect ratio), displayed at 680×680px.',
        required: true,
        minImages: 3,
        maxImages: 20,
      })
      return {
        ...field,
        validation: (Rule) =>
          applyRequired(Rule, true, 'Images is required')
            .min(3)
            .max(20)
            .custom(async (items: any[]) => {
              if (!items?.length) return true

              const dimensionValidator = createImageDimensionValidation({
                minWidth: 680,
                minHeight: 680,
                maxFileSize: 5,
              })

              for (const item of items) {
                const result = await dimensionValidator(item.image)
                if (result !== true) return result
              }

              return true
            }),
      }
    })(),
    createColorField({
      name: 'backgroundColor',
      title: 'Background Color',
      required: true,
    }),
  ],
  preview: {
    select: {
      images: 'images',
    },
    prepare({images}) {
      const count = images?.length || 0
      return {
        title: `Image Carousel`,
        subtitle: `${count} image${count !== 1 ? 's' : ''}`,
      }
    },
  },
})
