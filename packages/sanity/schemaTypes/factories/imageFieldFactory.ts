// packages/sanity/schemaTypes/factories/imageFieldFactory.ts

import {defineField} from 'sanity'
import {addRequiredLabel} from '../utils/fieldHelpers'
import {applyRequired} from '../utils/validation'
import {createTextField} from './textFieldFactory'

interface HotspotPreview {
  title: string
  aspectRatio: number
}

type ImageMetadataType = 'blurhash' | 'lqip' | 'palette' | 'exif' | 'location' | 'image'

interface ImageOptions {
  hotspot?:
    | boolean
    | {
        previews?: HotspotPreview[]
      }
  metadata?: ImageMetadataType[]
  accept?: string
}

interface SingleImageConfig {
  name?: string
  title?: string
  required?: boolean
  withCaption?: boolean
  captionMaxLength?: number
  description?: string
  altMaxLength?: number
  imageOptions?: ImageOptions
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
    description = '',
    altMaxLength = 150,
    imageOptions = {hotspot: true},
  } = config

  return defineField({
    name,
    title,
    type: 'image' as const,
    options: imageOptions,
    description: addRequiredLabel(description, required),
    fields: [
      createTextField({
        name: 'alt',
        title: 'Alt Text',
        required: false,
        maxLength: altMaxLength,
        description: 'Describe the image for accessibility (screen readers, SEO)',
      }),
      ...(withCaption
        ? [
            createTextField({
              name: 'caption',
              title: 'Caption',
              multiline: true,
              rows: 1,
              maxLength: captionMaxLength,
              description: 'Optional caption text displayed with the image',
            }),
          ]
        : []),
    ],
    validation: (Rule) => applyRequired(Rule, required, `${title} is required`),
  })
}

/**
 * Creates a multi-image array field using the global imageItem type
 * For galleries, grids, and collections of images
 */
export const createMultiImageField = (config: MultiImageConfig = {}) => {
  const {
    name = 'images',
    title = 'Images',
    required = false,
    minImages = 2,
    maxImages = 20,
    description = '',
  } = config

  return defineField({
    name,
    title,
    type: 'array',
    of: [{type: 'imageItem'}],
    description: addRequiredLabel(description, required),
    validation: (Rule) => {
      const baseRule = applyRequired(Rule, required, `${title} is required`)
      return baseRule
        .min(minImages)
        .max(maxImages)
        .error(`${title} must include ${minImages}-${maxImages} image${maxImages !== 1 ? 's' : ''}`)
    },
  })
}
