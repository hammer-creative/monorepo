// packages/sanity/schemaTypes/factories/imageFieldFactory.ts

// packages/sanity/schemaTypes/factories/imageFieldFactory.ts

import {defineField} from 'sanity'
import {addRequiredLabel} from '../utils/fieldHelpers'
import {createTextField} from './textFieldFactory'
import type {ImageRule, ArrayRule} from 'sanity'

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
    minWidth,
    minHeight,
    maxFileSize,
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
  const {minWidth, minHeight, maxFileSize} = baseField

  return defineField({
    name: baseField.name,
    title: baseField.title,
    type: baseField.type,
    options: baseField.options,
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
      console.log('🔧 Setting up validation with:', {minWidth, minHeight, maxFileSize, required})

      return Rule.custom((image: any) => {
        console.log('🔍 Custom validation running for:', image)

        // Check required first
        if (required && !image?.asset) {
          console.log('❌ Required check failed - no image')
          return `${baseField.title} is required`
        }

        // If not required and no image, that's fine
        if (!image?.asset) {
          console.log('⚠️ No asset, skipping dimension checks')
          return true
        }

        // No dimension/filesize constraints to check
        if (!minWidth && !minHeight && !maxFileSize) {
          console.log('✅ No constraints to check')
          return true
        }

        console.log('📎 Asset ref:', image.asset._ref)

        return new Promise((resolve) => {
          const query = `*[_id == "${image.asset._ref}"][0]{
        "dimensions": metadata.dimensions,
        "size": size
      }`

          console.log('🔎 Running query:', query)

          import('../../src/lib/sanity')
            .then(({client}) => {
              console.log('✅ Client imported successfully')
              client
                .fetch(query)
                .then((asset: any) => {
                  console.log('📊 Asset data received:', asset)

                  if (!asset) {
                    console.log('❌ No asset data returned')
                    return resolve(true)
                  }

                  const {dimensions, size} = asset

                  if (minWidth && dimensions?.width < minWidth) {
                    console.log(`❌ WIDTH FAIL: ${dimensions.width} < ${minWidth}`)
                    return resolve(
                      `Image must be at least ${minWidth}px wide (currently ${dimensions.width}px)`,
                    )
                  }

                  if (minHeight && dimensions?.height < minHeight) {
                    console.log(`❌ HEIGHT FAIL: ${dimensions.height} < ${minHeight}`)
                    return resolve(
                      `Image must be at least ${minHeight}px tall (currently ${dimensions.height}px)`,
                    )
                  }

                  if (maxFileSize) {
                    const maxBytes = maxFileSize * 1024 * 1024
                    if (size > maxBytes) {
                      const sizeMB = (size / (1024 * 1024)).toFixed(2)
                      console.log(`❌ FILESIZE FAIL: ${sizeMB}MB > ${maxFileSize}MB`)
                      return resolve(
                        `Image must be smaller than ${maxFileSize}MB (currently ${sizeMB}MB)`,
                      )
                    }
                  }

                  console.log('✅ All dimension/filesize checks passed')
                  resolve(true)
                })
                .catch((err) => {
                  console.error('❌ Fetch error:', err)
                  resolve(true)
                })
            })
            .catch((err) => {
              console.error('❌ Import error:', err)
              resolve(true)
            })
        })
      })
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
