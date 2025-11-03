// packages/sanity/schemaTypes/modules/multiVideoModule.ts

import {createVideoModule} from '../factories/videoModuleFactory'

export const multiVideoModule = createVideoModule({
  name: 'multiVideoModule',
  title: 'Multi Video',
  icon: '🎞️',
  multiVideo: true,
})
