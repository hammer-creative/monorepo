// apps/web/src/components/modules/Video/VideoModule.tsx

'use client';

import type { VideoModule as VideoModuleType } from '@/types/sanity.generated';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useViewportSize } from './hooks/useViewportSize';
import { VideoMulti } from './VideoMulti';
import { VideoSingle } from './VideoSingle';

function isValidVideoModule(
  data: VideoModuleType | null,
): data is VideoModuleType {
  return data !== null && Array.isArray(data.videos) && data.videos.length > 0;
}

export function VideoModule({ data }: { data: VideoModuleType | null }) {
  const { isMobile } = useViewportSize();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  const videos = useMemo(() => data?.videos || [], [data?.videos]);
  const mobileVideos = useMemo(
    () => data?.mobileVideos || [],
    [data?.mobileVideos],
  );

  const activeVideos = useMemo(() => {
    const count = videos.length;
    if (count === 3 && isMobile && mobileVideos.length === 3) {
      return mobileVideos;
    }
    return videos;
  }, [videos, mobileVideos, isMobile]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0, // Trigger as soon as any part leaves viewport
        rootMargin: '0px',
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!isValidVideoModule(data)) return null;

  if (videos.length === 1) {
    return (
      <div ref={containerRef}>
        <VideoSingle video={videos[0]} isInView={isInView} />
      </div>
    );
  }

  // Key forces remount when switching between desktop/mobile
  return (
    <div ref={containerRef}>
      <VideoMulti
        key={isMobile ? 'mobile' : 'desktop'}
        videos={activeVideos}
        isInView={isInView}
      />
    </div>
  );
}
