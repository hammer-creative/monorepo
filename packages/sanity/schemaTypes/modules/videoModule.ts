// packages/sanity/schemaTypes/modules/videoModule.ts

import {PlayIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createVideoField} from '../factories/videoFieldFactory'
import {createLimitedArrayInput} from '../utils/LimitedArrayInput'

/**
 * Video Module
 * Displays 1–3 videos with automatic layout
 */
export const videoModule = defineType({
  name: 'videoModule',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    {
      ...createVideoField({
        name: 'videos',
        title: 'Videos',
        required: true,
        minVideos: 1,
        maxVideos: 3,
        description: 'Add up to 3 videos',
      }),
      components: {
        input: createLimitedArrayInput(3, 'video'),
      },
    },
  ],
  preview: {
    select: {
      videos: 'videos',
    },
    prepare({videos}) {
      const count = videos?.length || 0
      const layouts = ['No videos', 'Full width', 'Half width', 'Thirds']

      return {
        title: `${count} Video${count !== 1 ? 's' : ''}`,
        subtitle: `Video Module • ${layouts[count]}`,
        media: videos?.[0]?.video?.asset,
      }
    },
  },
})
