// packages/sanity/schemaTypes/factories/imageFieldFactory.ts

import {defineField} from 'sanity'
import {addRequiredLabel} from '../utils/fieldHelpers'
import {createTextField} from './textFieldFactory'
import type {ImageRule, ArrayRule} from 'sanity'

interface HotspotPreview {
  title: string
  aspectRatio: number
}

interface ImageOptions {
  hotspot?:
    | boolean
    | {
        previews?: HotspotPreview[]
      }
  metadata?: string[]
  accept?: string
}

interface BaseImageConfig {
  name?: string
  title?: string
  altMaxLength?: number
  imageOptions?: ImageOptions
  minWidth?: number
  minHeight?: number
  maxFileSize?: number // in MB
}

interface SingleImageConfig extends BaseImageConfig {
  required?: boolean
  withCaption?: boolean
  captionMaxLength?: number
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
 * Base image field configuration shared by both single and multi-image fields
 * Handles validation for dimensions and file size
 */
function createBaseImageField(config: BaseImageConfig = {}) {
  const {
    name = 'image',
    title = 'Image',
    altMaxLength = 150,
    imageOptions = {hotspot: true},
    minWidth,
    minHeight,
    maxFileSize,
  } = config

  return {
    name,
    title,
    type: 'image' as const,
    options: imageOptions,
    fields: [
      createTextField({
        name: 'alt',
        title: 'Alt Text',
        required: true,
        maxLength: altMaxLength,
        description: 'Describe the image for accessibility (screen readers, SEO)',
      }),
    ],
    validation: (Rule: ImageRule) => {
      let rule = Rule

      // Dimension and file size validation
      if (minWidth || minHeight || maxFileSize) {
        rule = rule.custom((image: any) => {
          if (!image?.asset) return true

          return new Promise((resolve) => {
            const query = `*[_id == "${image.asset._ref}"][0]{
              "dimensions": metadata.dimensions,
              "size": size
            }`

            // Dynamic import to avoid circular dependency
            import('../../src/lib/sanity').then(({client}) => {
              client.fetch(query).then((asset: any) => {
                if (!asset) return resolve(true)

                const {dimensions, size} = asset

                // Check minimum width
                if (minWidth && dimensions?.width < minWidth) {
                  return resolve(
                    `Image must be at least ${minWidth}px wide (currently ${dimensions.width}px)`,
                  )
                }

                // Check minimum height
                if (minHeight && dimensions?.height < minHeight) {
                  return resolve(
                    `Image must be at least ${minHeight}px tall (currently ${dimensions.height}px)`,
                  )
                }

                // Check file size
                if (maxFileSize) {
                  const maxBytes = maxFileSize * 1024 * 1024
                  if (size > maxBytes) {
                    const sizeMB = (size / (1024 * 1024)).toFixed(2)
                    return resolve(
                      `Image must be smaller than ${maxFileSize}MB (currently ${sizeMB}MB)`,
                    )
                  }
                }

                resolve(true)
              })
            })
          })
        })
      }

      return rule
    },
  }
}

/**
 * Creates a single image field with alt text and optional caption
 * Uses Sanity's native image type with hotspot cropping support
 */
export const createSingleImageField = (config: SingleImageConfig = {}) => {
  const {
    required = false,
    withCaption = false,
    captionMaxLength = 200,
    description = '',
    ...baseConfig
  } = config

  const baseField = createBaseImageField(baseConfig)

  return defineField({
    ...baseField,
    description: addRequiredLabel(description, required),
    fields: [
      ...baseField.fields,
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
    validation: (Rule: ImageRule) => {
      const baseValidation = baseField.validation(Rule)
      return required
        ? baseValidation.required().error(`${baseField.title} is required`)
        : baseValidation
    },
  })
}

/**
 * Creates a multi-image array field using imageItem objects
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

/**
 * Export base for use in imageItem object
 */
export {createBaseImageField}
