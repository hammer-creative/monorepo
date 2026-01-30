// apps/web/src/components/motion/AnimateOnScroll/index.tsx
'use client';

import { useAnimate, useInView } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';

import type { AnimateConfig } from './types';

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  config?: AnimateConfig;
  disabled?: boolean;
}

export function AnimateOnScroll({
  children,
  className,
  config = {},
  disabled = false,
}: AnimateOnScrollProps) {
  const [scope, animate] = useAnimate();
  const hasAnimated = useRef(false);

  const {
    duration = 0.6,
    delay = 0,
    ease = 'easeOut',
    from = { opacity: 0, y: 40 },
    to = { opacity: 1, y: 0 },
    stagger,
    threshold = 0.2,
    once = true,
  } = config;

  const isInView = useInView(scope, { once, amount: threshold });

  // Set initial state
  useEffect(() => {
    if (disabled || !scope.current) return;

    if (stagger) {
      stagger.forEach((item) => {
        const itemFrom = item.from || from;
        try {
          animate(item.selector, itemFrom, { duration: 0 });
        } catch (e) {
          // Element doesn't exist yet, ignore
        }
      });
    } else {
      animate(scope.current, from, { duration: 0 });
    }
  }, [disabled, scope, animate, stagger, from]);

  // Animate when in view
  useEffect(() => {
    if (disabled || !isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    async function sequence() {
      if (stagger) {
        for (const item of stagger) {
          const itemTo = item.to || to;
          const itemEase = item.ease || ease;

          try {
            await animate(item.selector, itemTo, {
              duration: item.duration || duration,
              delay: item.delay || delay,
              ease: itemEase,
            });
          } catch (e) {
            // Element doesn't exist, ignore
          }
        }
      } else {
        await animate(scope.current, to, { duration, delay, ease });
      }
    }

    sequence();
  }, [isInView, disabled, animate, stagger, to, duration, delay, ease, scope]);

  // If disabled, just return children without wrapper
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
