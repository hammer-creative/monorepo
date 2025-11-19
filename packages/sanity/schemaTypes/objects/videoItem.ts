import {defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

export const videoItem = defineType({
  name: 'videoItem',
  title: 'Video',
  type: 'object',
  icon: PlayIcon,
  fields: [
    {
      name: 'title',
      title: 'Video Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'video',
      title: 'Video File',
      type: 'mux.video',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'poster',
      title: 'Poster Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'poster',
    },
  },
})
