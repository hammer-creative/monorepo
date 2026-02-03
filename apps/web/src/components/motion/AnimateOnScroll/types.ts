// apps/web/src/components/motion/AnimateOnScroll/types.ts

import type { Easing } from 'motion/react';

export type AnimationProperties = {
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
  rotate?: number;
  transform?: string;
};

export type StaggerItem = {
  selector: string;
  delay: number;
  from?: AnimationProperties;
  to?: AnimationProperties;
  duration?: number;
  ease?: Easing;
};

export type AnimateConfig = {
  delay?: number;
  duration?: number;
  ease?: Easing;
  from?: AnimationProperties;
  to?: AnimationProperties;
  stagger?: StaggerItem[];
  threshold?: number;
  once?: boolean;
};
