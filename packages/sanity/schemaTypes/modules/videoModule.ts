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

// Layout-specific poster dimension requirements (1.5x for high DPI)
// Single video: 2820×1590 (hero layout)
// Two videos: 1410×1410 (side-by-side)
// Three videos: 900×1500 (vertical stack)
const LAYOUT_REQUIREMENTS: Record<number, LayoutRequirements> = {
  1: {minWidth: 2820, minHeight: 1590, label: 'single-video'},
  2: {minWidth: 1410, minHeight: 1410, label: 'two-video'},
  3: {minWidth: 900, minHeight: 1500, label: 'three-video'},
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
        'Add 1-3 videos. Poster dimension requirements vary by count: 1 video requires 2820×1590px, 2 videos require 1410×1410px each, 3 videos require 900×1500px each.',
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
      const videoCount = videos?.length || 0
      let subtitle = 'Video Module'

      if (videoCount === 1) {
        subtitle = '1 Horizontal Video'
      } else if (videoCount === 2) {
        subtitle = '2 Square Videos'
      } else if (videoCount === 3) {
        subtitle = '3 Vertical Videos'
      }

      return {
        title: 'Video Module',
        subtitle,
      }
    },
  },
})
