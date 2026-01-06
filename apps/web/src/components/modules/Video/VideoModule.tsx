// apps/web/src/components/modules/Video/VideoModule.tsx
'use client';

import { useVideoControls } from '@/hooks/useVideoControls';
import { urlFor } from '@/lib/sanity/image';
import type { VideoModule as VideoModuleType } from '@/types/sanity.generated';
import { useMemo, useState } from 'react';

import { MuxVideo } from './MuxVideo';
import { MuteButton, PauseButton } from './VideoControls';
import { VideoModal } from './VideoModal';
import { VideoPoster } from './VideoPoster';
import { VideoProgressBar } from './VideoProgressBar';

// Type guard: Check if module data exists and is valid
function isValidVideoModule(
  data: VideoModuleType | null,
): data is VideoModuleType {
  return data !== null && Array.isArray(data.videos) && data.videos.length > 0;
}

export function VideoModule({ data }: { data: VideoModuleType | null }) {
  // Guard: Early return if no valid data
  if (!isValidVideoModule(data)) return null;

  const videos = data.videos || [];
  const count = videos.length;

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  // Use video controls hook for single video case
  const {
    videoRef,
    muted,
    isPaused,
    handlePlay,
    handlePause,
    handleTogglePlay,
    handleToggleMute,
  } = useVideoControls();

  // Memoize poster URLs so they're only computed once
  const videosWithPosters = useMemo(
    () =>
      videos.map((v) => ({
        ...v,
        posterUrl: v.poster?.asset ? urlFor(v.poster).auto('format').url() : '',
      })),
    [videos],
  );

  // Single Video: Play inline with controls
  if (count === 1) {
    const v = videosWithPosters[0];

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
            {/* Play/Pause Button */}
            <PauseButton
              className="video-modal-pause"
              onClick={handleTogglePlay}
              paused={isPaused}
            />

            {/* Mute Button */}
            <MuteButton
              className="video-modal-mute"
              muted={muted}
              onToggle={handleToggleMute}
            />

            {/* Video Player */}
            <MuxVideo
              ref={videoRef}
              videoItem={v}
              autoPlay
              priority
              muted={muted}
              onPlay={handlePlay}
              onPause={handlePause}
            />

            {/* Progress Bar */}
            <VideoProgressBar
              videoElement={videoRef.current}
              className="video-modal-progress"
            />
          </>
        )}
      </div>
    );
  }

  // Multiple Videos: Show posters and open in modal
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
