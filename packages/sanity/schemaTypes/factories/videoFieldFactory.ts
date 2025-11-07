// packages/sanity/schemaTypes/factories/videoModuleFactory.ts

import {defineField} from 'sanity'
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
    description,
    validation: (Rule: ArrayRule) => {
      let rule = Rule
      if (required) rule = rule.required()
      rule = rule.min(minVideos).max(maxVideos)
      return rule
    },
  })
}
