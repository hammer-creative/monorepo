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

// Poster image requirements (3x display size for high-res derivatives)
// Source images at 3x allow Sanity to generate crisp 1x, 1.5x, 2x, 3x variants
// Single video: 5640×3180 (landscape hero, ~16:9)
// Two videos: 2820×2820 (square side-by-side, 1:1)
// Three videos: 1860×3000 (vertical stack, ~3:5)
//
// Video specs (same for all layouts):
// - Resolution: 3840×2160 (4K)
// - Codec: H.264 or H.265
// - Bitrate: 25-50 Mbps
// - Format: MP4
const LAYOUT_REQUIREMENTS: Record<number, LayoutRequirements> = {
  1: {minWidth: 3840, minHeight: 2160, label: 'single-video'},
  2: {minWidth: 1880, minHeight: 1880, label: 'two-video'},
  3: {minWidth: 1200, minHeight: 2000, label: 'three-video'},
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
    return 'Poster image required'
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
        'Add 1-3 videos. Poster images should be high-resolution (3x display size): 1 video requires 3840 × 2160 px, 2 videos require 1880 × 1880 px each, 3 videos require 1200 × 2000 px each. Videos should be 4K, H.264/H.265, MP4 format.',
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
