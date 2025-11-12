// packages/sanity/schemaTypes/objects/videoItem.ts
import {PlayIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createTextField, createSingleImageField} from '../factories'

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
      title: 'Video',
      type: 'mux.video',
      validation: (Rule) => Rule.required(),
    },
    createSingleImageField({
      name: 'poster',
      title: 'Poster Image',
      description: 'Optional poster or animated GIF for this video',
      required: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'video.asset.data.duration',
      resolution: 'video.asset.data.max_stored_resolution',
      media: 'video.asset',
      poster: 'poster',
    },
    prepare({title, duration, resolution, media, poster}) {
      const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
      }

      const durationText = duration ? formatDuration(duration) : '0:00'

      return {
        title: title || 'Untitled Video',
        subtitle: `${durationText}${resolution ? ` • ${resolution}` : ''}`,
        media: poster || media,
      }
    },
  },
})
