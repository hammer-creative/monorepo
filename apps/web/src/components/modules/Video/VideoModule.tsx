// apps/web/src/components/modules/Video/VideoModule.tsx
import type { VideoModuleType } from '@/types/sanity';
import { useRef, useState } from 'react';
import { MuxVideo } from './MuxVideo';
import { MuteButton, PauseButton } from './VideoControls';
import { VideoModal } from './VideoModal';
import { VideoPoster } from './VideoPoster';
import { getPosterUrl } from './utils';

type VideoItem = VideoModuleType['videos'][number];

export function VideoModule({ data }: { data: VideoModuleType }) {
  const videos: VideoItem[] = data.videos || [];
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const count = videos.length;

  if (count === 0) return null;

  // Single full-width video
  if (count === 1) {
    const v = videos[0];
    const [isPlaying, setIsPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const videoRef = useRef<any>(null);

    const handlePause = () => {
      if (videoRef.current) {
        // console.log('videoRef.current:', videoRef.current);
        // console.log(
        //   'Available methods:',
        //   Object.getOwnPropertyNames(Object.getPrototypeOf(videoRef.current)),
        // );

        if (isPaused) {
          videoRef.current.play?.();
        } else {
          videoRef.current.pause?.();
        }
        setIsPaused(!isPaused);
      }
    };

    return (
      <div style={{ position: 'relative' }} className="single-video">
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

  // Multiple videos (flex layout)
  return (
    <>
      <div className="multi-video-flex">
        {videos.map((v, i) => (
          <div key={v._key || i} className="multi-video-item">
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
