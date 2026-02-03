// packages/sanity/schemaTypes/utils/validation.ts

import {client} from '../../src/lib/client'

const DISABLE_REQUIRED = process.env.SANITY_STUDIO_DISABLE_REQUIRED === 'true'

// console.log('SANITY_DISABLE_REQUIRED:', process.env.SANITY_DISABLE_REQUIRED)
// console.log('DISABLE_REQUIRED:', DISABLE_REQUIRED)

/**
 * Apply required validation with global disable toggle
 */
export const applyRequired = (Rule: any, required: boolean, message?: string) => {
  // console.log('applyRequired called:', {DISABLE_REQUIRED, required, message})
  if (DISABLE_REQUIRED || !required) return Rule
  return message ? Rule.required().error(message) : Rule.required()
}

/**
 * Conditional required validation for document-level rules
 */
export const requireWhen = (condition: boolean, message: string) => {
  if (DISABLE_REQUIRED || !condition) return true
  return message
}

/**
 * Create image dimension and file size validation function
 */
export const createImageDimensionValidation = (config: {
  minWidth?: number
  minHeight?: number
  maxFileSize?: number // in MB
}) => {
  const {minWidth, minHeight, maxFileSize} = config

  return (image: any) => {
    if (!image?.asset || (!minWidth && !minHeight && !maxFileSize)) {
      return true
    }

    return new Promise<string | true>((resolve) => {
      const query = `*[_id == "${image.asset._ref}"][0]{
        "dimensions": metadata.dimensions,
        "size": size
      }`

      client
        .fetch(query)
        .then((asset: any) => {
          if (!asset) return resolve(true)

          const {dimensions, size} = asset

          if (minWidth && dimensions?.width < minWidth) {
            return resolve(
              `Image must be at least ${minWidth}px wide (currently ${dimensions.width}px)`,
            )
          }

          if (minHeight && dimensions?.height < minHeight) {
            return resolve(
              `Image must be at least ${minHeight}px tall (currently ${dimensions.height}px)`,
            )
          }

          if (maxFileSize) {
            const maxBytes = maxFileSize * 1024 * 1024
            if (size > maxBytes) {
              const sizeMB = (size / (1024 * 1024)).toFixed(2)
              return resolve(`Image must be smaller than ${maxFileSize}MB (currently ${sizeMB}MB)`)
            }
          }

          resolve(true)
        })
        .catch(() => resolve(true))
    })
  }
}
