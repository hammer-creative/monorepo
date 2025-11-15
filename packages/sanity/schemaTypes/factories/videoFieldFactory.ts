// packages/sanity/schemaTypes/factories/videoModuleFactory.ts

import {defineField} from 'sanity'
import type {ArrayRule} from 'sanity'
import {addRequiredLabel} from '../utils/fieldHelpers'

interface VideoFieldConfig {
  name?: string
  title?: string
  required?: boolean
  minVideos?: number
  maxVideos?: number
  description?: string
}

export const createVideoField = (config: VideoFieldConfig = {}) => {
  const {
    name = 'videos',
    title = 'Videos',
    required = false,
    minVideos = 1,
    maxVideos = 3,
    description = '',
  } = config

  return defineField({
    name,
    title,
    type: 'array',

    // All three layouts remain valid options
    // because POSTER requirements differ per layout
    of: [{type: 'videoItemFullWidth'}, {type: 'videoItem50'}, {type: 'videoItem33'}],

    description: addRequiredLabel(description, required),

    // ❗ ONLY enforce min/max counts
    // ❗ DO NOT enforce type based on count anymore
    validation: (Rule: ArrayRule<any>) => {
      const base = required
        ? Rule.required().min(minVideos).max(maxVideos)
        : Rule.min(minVideos).max(maxVideos)

      return base.custom((videos: any[] | undefined) => {
        if (!videos?.length) {
          return required ? 'At least one video is required.' : true
        }

        // ❌ Removed expectedType logic
        // ❌ Removed layout enforcement
        // Only poster rules differ across item types now

        return true
      })
    },
  })
}
