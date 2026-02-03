// apps/web/src/components/common/AnimateOnScroll/presets.ts

import { DURATION, EASE, STATE } from './constants';
import type { AnimateConfig } from './types';

export const ANIMATION_PRESETS = {
  fadeUp: {
    ...STATE.fadeUp,
    duration: DURATION.normal,
    ease: EASE.default,
  },
  fadeUpSlow: {
    ...STATE.fadeUp,
    duration: DURATION.slow,
    ease: EASE.smooth,
  },
  fadeIn: {
    ...STATE.fadeIn,
    duration: DURATION.normal,
    ease: EASE.default,
  },
  slideLeft: {
    ...STATE.slideLeft,
    duration: DURATION.normal,
    ease: EASE.default,
  },
  scale: {
    ...STATE.scale,
    duration: DURATION.normal,
    ease: EASE.bounce,
  },
} as const satisfies Record<string, AnimateConfig>;
