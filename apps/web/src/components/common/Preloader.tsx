'use client';

import { useEffect, useRef, useState } from 'react';

const ENTER_DURATION = 2500;
const EXIT_DURATION = 2500;
const OVERLAP_AT = 0.3;
const FALLOFF = 100;
const PADDING = FALLOFF * 2 + 20;
const WIDTH = 700;
const TOTAL = WIDTH + PADDING * 2;

const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const pct = (n: number) => `${(((n + PADDING) / TOTAL) * 100).toFixed(2)}%`;

export default function Preloader({ progress }: { progress: number }) {
  const [visible, setVisible] = useState(true);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const enterStart = useRef<number | null>(null);
  const exitStart = useRef<number | null>(null);
  const animationFrame = useRef<number>();
  const threeReady = useRef(false);

  useEffect(() => {
    if (progress === 100) threeReady.current = true;
  }, [progress]);

  useEffect(() => {
    const updateStops = (leadPos: number, trailPos: number) => {
      const grad = gradientRef.current;
      if (!grad) return;
      grad.setAttribute('x1', pct(trailPos - FALLOFF * 2));
      grad.setAttribute('x2', pct(leadPos + FALLOFF * 2));
    };

    const animate = (now: number) => {
      if (!enterStart.current) enterStart.current = now;
      const enterElapsed = now - enterStart.current;
      const enterProgress = Math.min(1, enterElapsed / ENTER_DURATION);
      const enter = ease(enterProgress) * 100;

      if (enterProgress >= OVERLAP_AT && !exitStart.current) {
        exitStart.current = now;
      }

      let exit = 0;
      let exitProgress = 0;
      if (exitStart.current) {
        const exitElapsed = now - exitStart.current;
        exitProgress = Math.min(1, exitElapsed / EXIT_DURATION);
        exit = ease(exitProgress) * 100;
      }

      const leadPos = -PADDING + (enter / 100) * TOTAL;
      const trailPos = -PADDING + (exit / 100) * TOTAL;
      updateStops(leadPos, trailPos);

      if (exitProgress >= 1) {
        if (!threeReady.current) {
          enterStart.current = null;
          exitStart.current = null;
          requestAnimationFrame((t) => {
            enterStart.current = t;
            animationFrame.current = requestAnimationFrame(animate);
          });
          return;
        }
        preloaderRef.current?.classList.add('preloader--ready');
        return;
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={preloaderRef}
      className="preloader"
      onTransitionEnd={(e) => e.target === e.currentTarget && setVisible(false)}
    >
      <div className="preloader__wordmark">
        <svg
          viewBox={`-${PADDING} 0 ${TOTAL} 94`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              ref={gradientRef}
              id="hammerGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#141515" stopOpacity="0" />
              <stop offset="20%" stopColor="#778888" />
              <stop offset="40%" stopColor="#FFCC98" />
              <stop offset="100%" stopColor="#141515" stopOpacity="0" />
            </linearGradient>
            <mask id="letterMask">
              <path
                d="M523.17 94H602.38V69.95H549.74V58.79H601.85V34.64H549.74V24.14H602.38V0H523.17V94Z"
                fill="white"
              />
              <path
                d="M661.87 94H698.72L672.8 65.6C686.1 61.67 695.06 49.82 695.06 34.62C695.06 15.63 680.47 0 659.69 0H608.38V94H635.51V66.47H638.3L661.87 94ZM635.51 24.14H656.02C662.2 24.14 666.63 28.77 666.63 34.99C666.63 41.21 662.2 45.69 656.02 45.69H635.51V24.14Z"
                fill="white"
              />
              <path
                d="M124.54 0L93.7 94H122.98L128.37 78.12H170.57L175.96 94H205.24L174.57 0H124.54ZM136.47 53.98L147.64 19.35L158.81 53.98H136.47Z"
                fill="white"
              />
              <path
                d="M298.17 0L286.8 69.74H283.87L272.5 0H224.99L207.15 94H236.07L246.98 28.4H250.16L259.14 94H310.59L319.57 28.4H322.74L333.65 94H362.58L344.73 0H298.17Z"
                fill="white"
              />
              <path
                d="M455.75 0L444.38 69.74H441.45L430.08 0H382.5L364.66 94H393.58L404.49 28.4H407.67L416.65 94H468.1L477.08 28.4H480.25L491.16 94H520.09L502.24 0H455.75Z"
                fill="white"
              />
              <path
                d="M64.29 33.04H27.09V0H0V94H27.09V58.79H64.29V94H91.38V0H64.29V33.04Z"
                fill="white"
              />
            </mask>
          </defs>
          <rect
            x={-PADDING}
            y="0"
            width={TOTAL}
            height="94"
            fill="url(#hammerGrad)"
            mask="url(#letterMask)"
          />
        </svg>
      </div>
    </div>
  );
}
