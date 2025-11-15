// packages/sanity/schemaTypes/objects/videoItems.ts

import {createVideoItem} from '../factories/videoItemFactory'

// ------------------------------------------------------------
// POSTER VARIANTS (video playback is always full-width)
//
// Each type differs ONLY in:
// - poster minWidth
// - poster minHeight
// - poster aspectRatio
// - poster label
//
// Videos themselves NEVER change size.
// ------------------------------------------------------------

// Landscape poster (for 1-video modules)
export const videoItemFullWidth = createVideoItem({
  name: 'videoItemFullWidth',
  title: 'Video (Landscape Poster)',
  posterLabel: 'Landscape',
  minWidth: 1880,
  minHeight: 1060,
  aspectRatio: 16 / 9,
  aspectRatioLabel: '16:9',
})

// Square poster (for 2-video modules)
export const videoItem50 = createVideoItem({
  name: 'videoItem50',
  title: 'Video (Square Poster)',
  posterLabel: 'Square',
  minWidth: 940,
  minHeight: 940,
  aspectRatio: 1,
  aspectRatioLabel: '1:1',
})

// Portrait poster (for 3-video modules)
export const videoItem33 = createVideoItem({
  name: 'videoItem33',
  title: 'Video (Portrait Poster)',
  posterLabel: 'Portrait',
  minWidth: 600,
  minHeight: 1000,
  aspectRatio: 3 / 5,
  aspectRatioLabel: '3:5',
})
