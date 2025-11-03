// packages/sanity/schemaTypes/factories/videoModuleFactory.ts

import {defineType} from 'sanity'
import {headingField} from '../fields'
import type {Rule} from 'sanity'

export const createVideoModule = (config: {
  name: string
  title: string
  icon: string
  multiVideo?: boolean
}) =>
  defineType({
    name: config.name,
    title: config.title,
    type: 'object',
    icon: () => config.icon,
    preview: {
      select: config.multiVideo
        ? {
            title: 'heading',
            media: 'videos.0.video.asset',
            videos: 'videos',
          }
        : {
            title: 'heading',
            media: 'video.asset',
          },
      prepare(selection: any) {
        const {title, media, videos} = selection

        if (config.multiVideo) {
          const count = videos?.length || 0
          return {
            title: title || config.title,
            subtitle: `${count} video${count !== 1 ? 's' : ''}`,
            media: media,
          }
        }

        return {
          title: title || config.title,
          subtitle: config.title,
          media: media,
        }
      },
    },
    fields: config.multiVideo
      ? [
          headingField,
          {
            name: 'videos',
            title: 'Videos',
            type: 'array',
            of: [{type: 'videoItem'}],
            validation: (Rule: Rule) => Rule.required().min(1).max(3).error('Must have 1-3 videos'),
          },
        ]
      : [
          headingField,
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
            rows: 3,
          },
        ],
  })
