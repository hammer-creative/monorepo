'use client';

import { WordmarkSVGGradient } from '@/components/common/Wordmark';
import { useEffect, useRef, useState } from 'react';

const ENTER_DURATION = 2500;
const EXIT_DURATION = 2500;
const OVERLAP_AT = 0.3;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
export default function Preloader({ progress }: { progress: number }) {
  const [enter, setEnter] = useState(0);
  const [exit, setExit] = useState(0);
  const [visible, setVisible] = useState(true);
  const enterStart = useRef<number | null>(null);
  const exitStart = useRef<number | null>(null);
  const animationFrame = useRef<number>();
  const threeReady = useRef(false);

  useEffect(() => {
    if (progress === 100) threeReady.current = true;
  }, [progress]);

  useEffect(() => {
    const animate = (now: number) => {
      if (!enterStart.current) enterStart.current = now;
      const enterElapsed = now - enterStart.current;
      const enterProgress = Math.min(1, enterElapsed / ENTER_DURATION);
      setEnter(ease(enterProgress) * 100);

      if (enterProgress >= OVERLAP_AT && !exitStart.current) {
        exitStart.current = now;
      }

      if (exitStart.current) {
        const exitElapsed = now - exitStart.current;
        const exitProgress = Math.min(1, exitElapsed / EXIT_DURATION);
        setExit(ease(exitProgress) * 100);

        if (exitProgress >= 1) {
          console.log('exit done', threeReady.current);

          if (!threeReady.current) {
            enterStart.current = null;
            exitStart.current = null;
            setEnter(0);
            setExit(0);
            requestAnimationFrame((t) => {
              enterStart.current = t;
              animationFrame.current = requestAnimationFrame(animate);
            });
            return;
          }
          return;
        }
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
      className={`preloader${exit >= 100 && threeReady.current ? ' preloader--ready' : ''}`}
      onTransitionEnd={() => setVisible(false)}
    >
      <div className="preloader__wordmark">
        <WordmarkSVGGradient enter={enter} exit={exit} />
      </div>
    </div>
  );
}
