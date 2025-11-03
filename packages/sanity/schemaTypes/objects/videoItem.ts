// apps/packages/sanity/schemaTypes/objects/videoItem.ts

import {defineType} from 'sanity'
import type {Rule} from 'sanity'

export const videoItem = defineType({
  name: 'videoItem',
  title: 'Video Item',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Video Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'video',
      title: 'Video',
      type: 'mux.video',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'video.asset',
    },
    prepare({title, media}) {
      return {
        title: title || 'Untitled Video',
        media: media,
      }
    },
  },
})
