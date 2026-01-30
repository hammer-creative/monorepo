// apps/web/src/app/page.animations.ts

import type { AnimateConfig } from '@/components/motion/AnimateOnScroll';
import {
  DELAY,
  DURATION,
  STATE,
} from '@/components/motion/AnimateOnScroll/constants';

export const homePageAnimations = {
  textModuleFirst: {
    stagger: [
      {
        selector: 'p',
        delay: DELAY.none,
        duration: DURATION.slow,
        ...STATE.fadeUp,
      },
    ],
    threshold: 0,
  },
  textModuleSecond: {
    stagger: [
      {
        selector: '.tag',
        delay: DELAY.none,
        ...STATE.fadeIn,
      },
      {
        selector: 'p',
        delay: DELAY.short,
        ...STATE.fadeUp,
      },
    ],
    threshold: 0.2,
  },
} satisfies Record<string, AnimateConfig>;
