// apps/web/src/components/modules/Video/VideoModule.tsx
'use client';

import { urlFor } from '@/lib/sanity/image';
import type { VideoModuleType } from '@/types/sanity';
import { useRef, useState } from 'react';
import { MuxVideo } from './MuxVideo';
import { MuteButton, PauseButton } from './VideoControls';
import { VideoModal } from './VideoModal';
import { VideoPoster } from './VideoPoster';

// apps/web/src/components/modules/Video/VideoModule.tsx

type VideoItem = VideoModuleType['videos'][number];

export function VideoModule({ data }: { data: VideoModuleType }) {
  const videos: VideoItem[] = data.videos || [];
  const count = videos.length;

  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  if (count === 0) return null;

  const getPosterUrl = (video: VideoItem) => {
    return video.poster?.asset ? urlFor(video.poster).url() : '';
  };

  if (count === 1) {
    const v = videos[0];

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
            title={v.title}
            posterUrl={getPosterUrl(v)}
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
              video={v.video}
              title={v.title}
              posterUrl={getPosterUrl(v)}
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
        {videos.map((v, i) => (
          <div key={v._key || i} className="row video-item">
            <VideoPoster
              video={v.video}
              title={v.title}
              posterUrl={getPosterUrl(v)}
              onClick={() => setActiveVideo(i)}
            />
          </div>
        ))}
      </div>

      {activeVideo !== null && (
        <VideoModal
          video={videos[activeVideo].video}
          title={videos[activeVideo].title}
          open
          onOpenChange={(open) => !open && setActiveVideo(null)}
        />
      )}
    </>
  );
}
