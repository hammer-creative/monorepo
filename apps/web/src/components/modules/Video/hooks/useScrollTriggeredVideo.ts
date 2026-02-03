// apps/web/src/components/modules/Video/hooks/useScrollTriggeredVideo.ts

import { useEffect, useRef } from 'react';

import { VIDEO_CONFIG } from '../constants';

interface UseScrollTriggeredVideoProps {
  enabled: boolean;
  videoCount: number;
}

export function useScrollTriggeredVideo({
  enabled,
  videoCount,
}: UseScrollTriggeredVideoProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const playedVideosRef = useRef(new Set<number>());
  const playTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (!enabled || videoCount <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(
            entry.target.getAttribute('data-video-index') || '0',
            10,
          );
          const video = videoRefs.current[index];

          if (!video) return;

          // Clear any pending play timeout
          const existingTimeout = playTimeoutsRef.current.get(index);
          if (existingTimeout) {
            clearTimeout(existingTimeout);
            playTimeoutsRef.current.delete(index);
          }

          if (entry.isIntersecting) {
            const hasPlayed = playedVideosRef.current.has(index);
            const delay = hasPlayed ? 0 : index * VIDEO_CONFIG.STAGGER_DELAY;

            const timeout = setTimeout(() => {
              video.play().catch((err: Error) => {
                // Ignore AbortError - it's expected when quickly pausing/playing
                if (err.name !== 'AbortError') {
                  console.error(`Failed to play video ${index}:`, err);
                }
              });
              playedVideosRef.current.add(index);
              playTimeoutsRef.current.delete(index);
            }, delay);

            playTimeoutsRef.current.set(index, timeout);
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: VIDEO_CONFIG.INTERSECTION_THRESHOLD,
        rootMargin: VIDEO_CONFIG.INTERSECTION_ROOT_MARGIN,
      },
    );

    containerRefs.current.forEach((container) => {
      if (container) observer.observe(container);
    });

    // Check for videos already in viewport on mount
    setTimeout(() => {
      containerRefs.current.forEach((container, index) => {
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInViewport && !playedVideosRef.current.has(index)) {
          const video = videoRefs.current[index];
          if (video) {
            const timeout = setTimeout(() => {
              video.play().catch((err: Error) => {
                if (err.name !== 'AbortError') {
                  console.error(`Failed to autoplay video ${index}:`, err);
                }
              });
              playedVideosRef.current.add(index);
              playTimeoutsRef.current.delete(index);
            }, index * VIDEO_CONFIG.STAGGER_DELAY);

            playTimeoutsRef.current.set(index, timeout);
          }
        }
      });
    }, VIDEO_CONFIG.VIEWPORT_CHECK_DELAY);

    return () => {
      observer.disconnect();
      // Clear all pending timeouts
      playTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      playTimeoutsRef.current.clear();
    };
  }, [enabled, videoCount]);

  return { videoRefs, containerRefs };
}
