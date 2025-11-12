// packages/sanity/schemaTypes/factories/videoModuleFactory.ts

import {defineField} from 'sanity'
import {addRequiredLabel} from '../utils/fieldHelpers'
import type {ArrayRule} from 'sanity'

interface VideoFieldConfig {
  name?: string
  title?: string
  required?: boolean
  minVideos?: number
  maxVideos?: number
  description?: string
}

/**
 * Creates a video array field using videoItem objects
 * For single or multiple video layouts
 */
export const createVideoField = (config: VideoFieldConfig = {}) => {
  const {
    name = 'videos',
    title = 'Videos',
    required = false,
    minVideos = 1,
    maxVideos = 3,
    description = `Add ${minVideos}-${maxVideos} videos`,
  } = config

  return defineField({
    name,
    title,
    type: 'array',
    of: [{type: 'videoItem'}],
    description: addRequiredLabel(description, required),
    validation: required
      ? (Rule: ArrayRule<any>) =>
          Rule.required()
            .min(minVideos)
            .max(maxVideos)
            .error(`${title} requires between ${minVideos} and ${maxVideos} videos`)
      : (Rule: ArrayRule<any>) =>
          Rule.min(minVideos)
            .max(maxVideos)
            .error(`${title} requires between ${minVideos} and ${maxVideos} videos`),
  })
}
