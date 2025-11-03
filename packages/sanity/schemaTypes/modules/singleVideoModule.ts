// packages/sanity/schemaTypes/modules/singleVideoModule.ts

import {createVideoModule} from '../factories/videoModuleFactory'

export const singleVideoModule = createVideoModule({
  name: 'singleVideoModule',
  title: 'Single Video',
  icon: '🎬',
  multiVideo: false,
})
