// apps/web/src/components/modules/CaseStudyCard/caseStudy.animations.ts

import {
  DELAY,
  DURATION,
  STATE,
  type AnimateConfig,
} from '@/components/motion/AnimateOnScroll';

// Single card animation for mobile (scroll-into-view)
export const caseStudyAnimations = {
  card: {
    stagger: [
      {
        selector: '.image img',
        delay: DELAY.none,
        duration: DURATION.slow,
        from: { opacity: 0, scale: 1.05 },
        to: { opacity: 1, scale: 1 },
      },
      {
        selector: '.case-study-title',
        delay: DELAY.none,
        duration: DURATION.normal,
        ...STATE.fadeUp,
      },
      {
        selector: '.clients',
        delay: DELAY.none,
        duration: DURATION.normal,
        ...STATE.fadeUp,
      },
    ],
    threshold: 0.3,
  },
} satisfies Record<string, AnimateConfig>;

// Base animation for a single card's elements
const cardElementAnimations = [
  {
    selector: '.image img',
    delay: DELAY.none,
    duration: DURATION.fast,
    from: { opacity: 0, scale: 1.05 },
    to: { opacity: 1, scale: 1 },
  },
  {
    selector: '.case-study-title',
    delay: DELAY.none,
    duration: DURATION.fast,
    ...STATE.fadeUp,
  },
  {
    selector: '.clients',
    delay: DELAY.none,
    duration: DURATION.fast,
    ...STATE.fadeUp,
  },
];

// Generate chained animations for all cards (desktop)
export function generateCaseStudyAnimations(cardCount: number): AnimateConfig {
  return {
    stagger: Array.from({ length: cardCount }, (_, index) => {
      const nth = index + 1;
      return cardElementAnimations.map((animation) => ({
        ...animation,
        selector: `.case-study-card:nth-child(${nth}) ${animation.selector}`,
      }));
    }).flat(),
    threshold: 0.3,
  };
}
