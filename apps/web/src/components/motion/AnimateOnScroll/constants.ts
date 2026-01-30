// apps/web/src/components/common/AnimateOnScroll/constants.ts

export const EASE = {
  default: [0.4, 0, 0.2, 1],
  smooth: [0.33, 1, 0.68, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  sharp: [0.4, 0, 0.6, 1],
  linear: [0, 0, 1, 1],
} as const;

export const DURATION = {
  fast: 0.1,
  normal: 0.6,
  slow: 0.9,
  verySlow: 1.2,
} as const;

export const DELAY = {
  none: 0,
  short: 0.1,
  medium: 0.2,
  long: 0.3,
} as const;

export const TRANSFORM = {
  y: {
    small: 20,
    medium: 40,
    large: 60,
  },
  x: {
    small: 20,
    medium: 40,
    large: 60,
  },
  scale: {
    shrink: 0.8,
    grow: 1.2,
  },
} as const;

export const STATE = {
  fadeUp: {
    from: { opacity: 0, y: TRANSFORM.y.medium },
    to: { opacity: 1, y: 0 },
  },
  fadeDown: {
    from: { opacity: 0, y: -TRANSFORM.y.medium },
    to: { opacity: 1, y: 0 },
  },
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideLeft: {
    from: { opacity: 0, x: TRANSFORM.x.large },
    to: { opacity: 1, x: 0 },
  },
  slideRight: {
    from: { opacity: 0, x: -TRANSFORM.x.large },
    to: { opacity: 1, x: 0 },
  },
  scale: {
    from: { opacity: 0, scale: TRANSFORM.scale.shrink },
    to: { opacity: 1, scale: 1 },
  },
} as const;
