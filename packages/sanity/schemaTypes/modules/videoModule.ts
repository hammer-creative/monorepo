// packages/sanity/schemaTypes/modules/videoModule.ts

import {defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'
import {createColorField} from '../factories'

interface VideoItem {
  poster?: {
    asset?: {
      _ref?: string
    }
  }
}

interface LayoutRequirements {
  minWidth: number
  minHeight: number
  label: string
}

// Layout-specific poster dimension requirements
// Single video: 1880×1060 (hero layout)
// Two videos: 940×940 (side-by-side)
// Three videos: 600×1000 (vertical stack)
const LAYOUT_REQUIREMENTS: Record<number, LayoutRequirements> = {
  1: {minWidth: 1880, minHeight: 1060, label: 'single-video'},
  2: {minWidth: 940, minHeight: 940, label: 'two-video'},
  3: {minWidth: 600, minHeight: 1000, label: 'three-video'},
}

const DIMENSION_REGEX = /-(\d+)x(\d+)-/

function extractDimensions(ref: string): {width: number; height: number} | null {
  const match = ref.match(DIMENSION_REGEX)
  if (!match) return null
  return {
    width: Number(match[1]),
    height: Number(match[2]),
  }
}

function validateVideoPoster(video: VideoItem, requirements: LayoutRequirements): string | true {
  const ref = video?.poster?.asset?._ref

  if (!ref) {
    return 'Poster is required'
  }

  const dimensions = extractDimensions(ref)

  if (!dimensions) {
    return 'Poster dimensions missing'
  }

  const {width, height} = dimensions
  const {minWidth, minHeight, label} = requirements

  if (width < minWidth || height < minHeight) {
    return `Poster must be ≥ ${minWidth}×${minHeight} for ${label} layout`
  }

  return true
}

export const videoModule = defineType({
  name: 'videoModule',
  title: 'Video Module',
  type: 'object',
  icon: PlayIcon,

  fields: [
    {
      name: 'videos',
      title: 'Videos',
      type: 'array',
      description:
        'Add 1-3 videos. Poster dimension requirements vary by count: 1 video requires 1880×1060px, 2 videos require 940×940px each, 3 videos require 600×1000px each.',
      of: [{type: 'videoItem'}],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(3)
          .custom((videos: VideoItem[]) => {
            if (!Array.isArray(videos)) return true

            const requirements = LAYOUT_REQUIREMENTS[videos.length]
            if (!requirements) return true

            for (const video of videos) {
              const result = validateVideoPoster(video, requirements)
              if (result !== true) return result
            }

            return true
          }),
    },
    createColorField({
      name: 'backgroundColor',
      title: 'Background Color',
      required: false,
    }),
  ],

  preview: {
    select: {
      videos: 'videos',
    },
    prepare({videos}: any) {
      return {
        title: `${videos?.length || 0} video${videos?.length !== 1 ? 's' : ''}`,
        subtitle: 'Video Module',
      }
    },
  },
})
