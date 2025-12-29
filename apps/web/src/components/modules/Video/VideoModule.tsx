// apps/web/src/components/modules/Video/VideoModule.tsx
'use client';

import { urlFor } from '@/lib/sanity/image';
import type { VideoModule as VideoModuleType } from '@/types/sanity.generated';
import { useRef, useState, useMemo } from 'react';
import { MuxVideo } from './MuxVideo';
import { MuteButton, PauseButton } from './VideoControls';
import { VideoModal } from './VideoModal';
import { VideoPoster } from './VideoPoster';

// apps/web/src/components/modules/Video/VideoModule.tsx

// apps/web/src/components/modules/Video/VideoModule.tsx

export function VideoModule({ data }: { data: VideoModuleType }) {
  const videos = data.videos || [];
  const count = videos.length;

  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  // Memoize poster URLs so they're only computed once
  const videosWithPosters = useMemo(
    () =>
      videos.map((v) => ({
        ...v,
        posterUrl: v.poster?.asset ? urlFor(v.poster).auto('format').url() : '',
      })),
    [videos],
  );

  if (count === 0) return null;

  if (count === 1) {
    const v = videosWithPosters[0];

    const handlePause = () => {
      if (!videoRef.current) return;

      if (isPaused) {
        videoRef.current.play?.();
      } else {
        videoRef.current.pause?.();
      }

      setIsPaused(!isPaused);
    };

    return (
      <div style={{ position: 'relative' }} className="container single-video">
        {!isPlaying ? (
          <VideoPoster
            video={v.video}
            title={v.title || ''}
            posterUrl={v.posterUrl}
            onClick={() => setIsPlaying(true)}
          />
        ) : (
          <>
            <PauseButton className="video-modal-pause" onClick={handlePause} />

            <MuteButton
              className="video-modal-mute"
              muted={muted}
              onToggle={() => setMuted((m) => !m)}
            />

            <MuxVideo
              ref={videoRef}
              videoItem={v}
              autoPlay
              priority
              muted={muted}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="container multi-video">
        {videosWithPosters.map((v, i) => (
          <div key={v._key || i} className="row video-item">
            <VideoPoster
              video={v.video}
              title={v.title || ''}
              posterUrl={v.posterUrl}
              onClick={() => setActiveVideo(i)}
            />
          </div>
        ))}
      </div>

      {activeVideo !== null && (
        <VideoModal
          videoItem={videosWithPosters[activeVideo]}
          open
          onOpenChange={(open: boolean) => !open && setActiveVideo(null)}
        />
      )}
    </>
  );
}
