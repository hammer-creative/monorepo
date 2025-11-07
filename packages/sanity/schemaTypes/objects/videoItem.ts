// apps/packages/sanity/schemaTypes/objects/videoItem.ts

import {PlayIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createTextField} from '../factories/textFieldFactory'

/**
 * Video Item Object
 * Individual video within a video module
 */
export const videoItem = defineType({
  name: 'videoItem',
  title: 'Video Item',
  type: 'object',
  icon: PlayIcon,
  fields: [
    createTextField({
      name: 'title',
      title: 'Video Title',
      required: true,
      maxLength: 100,
    }),
    {
      name: 'video',
      type: 'mux.video',
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'video.asset.data.duration',
      resolution: 'video.asset.data.max_stored_resolution',
      encodingTier: 'video.asset.data.encoding_tier',
      videoQuality: 'video.asset.data.video_quality',
      media: 'video.asset',
    },
    prepare({title, duration, resolution, encodingTier, videoQuality, media}) {
      // Format duration as MM:SS
      const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
      }

      const durationText = duration ? formatDuration(duration) : '0:00'
      const details = [resolution || 'Unknown', encodingTier || '', videoQuality || '']
        .filter(Boolean)
        .join(' • ')

      return {
        title: title || 'Untitled Video',
        subtitle: `${durationText} • ${details}`,
        media,
      }
    },
  },
})
