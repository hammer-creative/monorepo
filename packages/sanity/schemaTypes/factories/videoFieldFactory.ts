// packages/sanity/schemaTypes/factories/videoFieldFactory.ts

import {defineField} from 'sanity'
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
    of: [{type: 'videoItem'}],
    description: addRequiredLabel(description, required),
    validation: (Rule) => {
      let validation = Rule.min(minVideos).max(maxVideos)
      return required ? validation.required() : validation
    },
  })
}
