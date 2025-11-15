// packages/sanity/schemaTypes/factories/videoItemFactory.tsnex

import {PlayIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createTextField, createSingleImageField} from '../factories'

interface VideoItemConfig {
  name: string
  title: string
  posterLabel: string // clearer: this layout affects POSTER ONLY
  minWidth: number
  minHeight: number
  aspectRatio: number
  aspectRatioLabel: string
}

export function createVideoItem(config: VideoItemConfig) {
  const {name, title, posterLabel, minWidth, minHeight, aspectRatio, aspectRatioLabel} = config

  return defineType({
    name,
    title,
    type: 'object',
    icon: PlayIcon,

    fields: [
      createTextField({
        name: 'title',
        title: 'Title',
        required: true,
        maxLength: 100,
      }),

      {
        name: 'video',
        title: 'Video',
        type: 'mux.video',
        validation: (Rule) => Rule.required(), // always required
      },

      // POSTER RULES — the ONLY part that differs by item type
      createSingleImageField({
        name: 'poster',
        title: 'Poster Image',
        description: `${posterLabel} poster — minimum ${minWidth}×${minHeight}px`,
        required: true,
        minWidth,
        minHeight,
        maxFileSize: 5, // MB
        imageOptions: {
          hotspot: {
            previews: [{title: aspectRatioLabel, aspectRatio}],
          },
        },
      }),
    ],

    preview: {
      select: {
        title: 'title',
        duration: 'video.asset.data.duration',
        resolution: 'video.asset.data.max_stored_resolution',
        media: 'poster',
      },

      prepare({title, duration, resolution, media}) {
        const formatDuration = (seconds: number) => {
          const mins = Math.floor(seconds / 60)
          const secs = Math.floor(seconds % 60)
          return `${mins}:${secs.toString().padStart(2, '0')}`
        }

        const durationText = duration ? formatDuration(duration) : '0:00'

        return {
          title: title || 'Untitled Video',
          subtitle: `${posterLabel} • ${durationText}${resolution ? ` • ${resolution}` : ''}`,
          media,
        }
      },
    },
  })
}
