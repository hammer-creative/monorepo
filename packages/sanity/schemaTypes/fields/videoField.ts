// packages/sanity/schemaTypes/fields/videoField.ts

import {createVideoField} from '../factories/videoFieldFactory'

// Reusable video array field (1–3 items)
// Poster requirements vary per item type.
// Video playback is always full-width everywhere.
export const videoField = createVideoField()
