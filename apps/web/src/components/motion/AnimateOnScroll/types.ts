// apps/web/src/components/motion/AnimateOnScroll/types.ts

export type AnimationConfig = {
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
  rotate?: number;
};

export type StaggerConfig = {
  selector: string;
  delay: number;
  from?: AnimationConfig;
  to?: AnimationConfig;
  duration?: number;
  ease?: number[];
};

export type AnimateConfig = {
  delay?: number;
  duration?: number;
  ease?: number[];
  from?: AnimationConfig;
  to?: AnimationConfig;
  stagger?: StaggerConfig[];
  threshold?: number;
  once?: boolean;
};
