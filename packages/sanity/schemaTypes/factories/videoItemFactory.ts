// packages/sanity/schemaTypes/factories/videoItemFactory.ts

import {PlayIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createTextField, createSingleImageField} from '../factories'
import {applyRequired} from '../utils/validation'

interface VideoItemConfig {
  name: string
  title: string
  posterLabel: string
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
      (() => {
        const {validation: _, ...field} = createTextField({
          name: 'title',
          title: 'Title',
          required: false,
          maxLength: 100,
        })
        return {
          ...field,
          validation: (Rule) => applyRequired(Rule, true, 'Title is required').max(100),
        }
      })(),
      {
        name: 'video',
        title: 'Video',
        type: 'mux.video',
        validation: (Rule) => applyRequired(Rule, true, 'Video is required'),
      },
      (() => {
        const {validation: _, ...field} = createSingleImageField({
          name: 'poster',
          title: 'Poster Image',
          description: `${posterLabel} poster — minimum ${minWidth}×${minHeight}px`,
          required: false,
          imageOptions: {
            hotspot: {
              previews: [{title: aspectRatioLabel, aspectRatio}],
            },
          },
        })
        return {
          ...field,
          validation: (Rule) => applyRequired(Rule, true, 'Poster Image is required'),
        }
      })(),
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
