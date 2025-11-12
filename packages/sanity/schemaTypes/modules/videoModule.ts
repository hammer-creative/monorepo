// packages/sanity/schemaTypes/modules/videoModule.ts

import {VideoIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createVideoField, createColorField} from '../factories'
import {createLimitedArrayInput} from '../utils/LimitedArrayInput'

/**
 * Video Module
 * Displays 1–3 videos with automatic layout
 */
export const videoModule = defineType({
  name: 'videoModule',
  title: 'Video Module',
  type: 'object',
  icon: VideoIcon,
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
    createColorField({
      name: 'backgroundColor',
      title: 'Background Color',
      required: true,
    }),
  ],
  preview: {
    select: {
      videos: 'videos',
      backgroundColor: 'backgroundColor',
    },
    prepare({videos, backgroundColor}) {
      const count = videos?.length || 0
      const layouts = ['No videos', 'Full width', 'Half width', 'Thirds']

      return {
        title: `${count} Video${count !== 1 ? 's' : ''}`,
        subtitle: [layouts[count], backgroundColor?.enabled ? `BG: ${backgroundColor.name}` : null]
          .filter(Boolean)
          .join(' • '),
        media: videos?.[0]?.video?.asset,
      }
    },
  },
})
