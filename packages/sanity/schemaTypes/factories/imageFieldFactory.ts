// packages/sanity/schemaTypes/factories/imageFieldFactory.ts

import {defineField} from 'sanity'
import {addRequiredLabel} from '../utils/fieldHelpers'
import {createTextField} from './textFieldFactory'
import type {ImageRule, ArrayRule} from 'sanity'

interface SingleImageConfig {
  name?: string
  title?: string
  required?: boolean
  withCaption?: boolean
  captionMaxLength?: number
  altMaxLength?: number
  hotspot?: boolean
  description?: string
}

interface MultiImageConfig {
  name?: string
  title?: string
  required?: boolean
  minImages?: number
  maxImages?: number
  description?: string
}

/**
 * Creates a single image field with alt text and optional caption
 * Uses Sanity's native image type with hotspot cropping support
 */
export const createSingleImageField = (config: SingleImageConfig = {}) => {
  const {
    name = 'image',
    title = 'Image',
    required = false,
    withCaption = false,
    captionMaxLength = 200,
    altMaxLength = 150,
    hotspot = true,
    description = '',
  } = config

  return defineField({
    name,
    title,
    type: 'image',
    description: addRequiredLabel(description, required),
    options: {hotspot},
    fields: [
      createTextField({
        name: 'alt',
        title: 'Alt Text',
        required: true,
        maxLength: altMaxLength,
        description: 'Describe the image for accessibility (screen readers, SEO)',
      }),
      ...(withCaption
        ? [
            createTextField({
              name: 'caption',
              title: 'Caption',
              multiline: true,
              rows: 2,
              maxLength: captionMaxLength,
              description: 'Optional caption text displayed with the image',
            }),
          ]
        : []),
    ],
    validation: required
      ? (Rule: ImageRule) => Rule.required().error(`${title} is required`)
      : undefined,
  })
}

/**
 * Creates a multi-image array field using imageItem objects
 * For galleries, grids, and collections of images
 */
export const createMultiImageField = (config: MultiImageConfig = {}) => {
  const {
    name = 'imageItems',
    title = 'Images',
    required = false,
    minImages = 4,
    maxImages = 20,
    description = '',
  } = config

  return defineField({
    name,
    title,
    type: 'array',
    of: [{type: 'imageItem'}],
    description: addRequiredLabel(description, required),
    validation: required
      ? (Rule: ArrayRule<any>) =>
          Rule.required()
            .min(minImages)
            .max(maxImages)
            .error(
              `${title} must include ${minImages}-${maxImages} image${maxImages !== 1 ? 's' : ''}`,
            )
      : (Rule: ArrayRule<any>) =>
          Rule.min(minImages)
            .max(maxImages)
            .error(
              `${title} must include ${minImages}-${maxImages} image${maxImages !== 1 ? 's' : ''}`,
            ),
  })
}
