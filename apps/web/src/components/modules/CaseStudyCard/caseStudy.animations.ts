// apps/web/src/components/modules/CaseStudyCard/caseStudy.animations.ts

import {
  DELAY,
  DURATION,
  STATE,
  type AnimateConfig,
} from '@/components/motion/AnimateOnScroll';

export const caseStudyAnimations = {
  card: {
    stagger: [
      {
        selector: '.image img',
        delay: DELAY.none,
        duration: 0.2,
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      {
        selector: '.image img',
        delay: DELAY.none,
        duration: DURATION.slow,
        from: { scale: 1.05 },
        to: { scale: 1 },
      },
      {
        selector: '.case-study-title',
        delay: DELAY.short,
        duration: DURATION.normal,
        ...STATE.fadeUp,
      },
      {
        selector: '.clients',
        delay: DELAY.medium,
        duration: DURATION.normal,
        ...STATE.fadeUp,
      },
    ],
    threshold: 0.3,
  },
} satisfies Record<string, AnimateConfig>;
