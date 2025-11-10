// apps/packages/sanity/schemaTypes/objects/videoItem.ts

import {PlayIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createTextField} from '../factories/textFieldFactory'
// ✅ ADD: import poster helper
import {createSingleImageField} from '../factories/imageFieldFactory'

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
    // ✅ ADD: per-video poster (jpg/gif)
    createSingleImageField({
      name: 'poster',
      title: 'Poster (JPG or GIF)',
      description: 'Optional poster or animated GIF for this video',
      required: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'video.asset.data.duration',
      resolution: 'video.asset.data.max_stored_resolution',
      encodingTier: 'video.asset.data.encoding_tier',
      videoQuality: 'video.asset.data.video_quality',
      media: 'video.asset',
      // ✅ ADD: use poster in preview if provided
      poster: 'poster',
    },
    prepare({title, duration, resolution, encodingTier, videoQuality, media, poster}) {
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
        // ✅ ADD: prefer poster, fallback to mux asset
        media: poster || media,
      }
    },
  },
})
