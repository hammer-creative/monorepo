// packages/sanity/schemaTypes/modules/videoModule.ts

import {PlayIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createVideoField} from '../factories/videoFieldFactory'

export const videoModule = defineType({
  name: 'videoModule',
  title: 'Video Module',
  type: 'object',
  icon: PlayIcon,

  fields: [
    createVideoField({
      name: 'videos',
      title: 'Videos',
      required: true,
      minVideos: 1,
      maxVideos: 3,
      description:
        'Add 1–3 videos. Posters have different required dimensions depending on the poster type selected.',
    }),
  ],

  preview: {
    select: {
      firstTitle: 'videos.0.title',
    },
    prepare({firstTitle}) {
      return {
        title: firstTitle || 'Video Module',
        subtitle: 'Contains 1–3 videos',
      }
    },
  },
})
