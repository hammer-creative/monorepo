// apps/web/src/components/modules/Video/VideoModule.tsx

'use client';

import type { VideoModule as VideoModuleType } from '@/types/sanity.generated';
import { useMemo } from 'react';

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

  if (!isValidVideoModule(data)) return null;

  if (videos.length === 1) {
    return <VideoSingle video={videos[0]} />;
  }

  // Key forces remount when switching between desktop/mobile
  return (
    <VideoMulti key={isMobile ? 'mobile' : 'desktop'} videos={activeVideos} />
  );
}
