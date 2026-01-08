// apps/web/src/components/modules/Video/VideoModule.tsx
'use client';

import { useVideoControls } from '@/hooks/useVideoControls';
import type {
  MuxVideoAsset,
  VideoModule as VideoModuleType,
} from '@/types/sanity.generated';
import { useEffect, useMemo, useRef, useState } from 'react';

import { MuxVideo } from './MuxVideo';
import { parseAspectRatio } from './utils';
import { MuteButton, PauseButton } from './VideoControls';
import { VideoPoster } from './VideoPoster';
import { VideoProgressBar } from './VideoProgressBar';

// Type guard: Check if module data exists and is valid
function isValidVideoModule(
  data: VideoModuleType | null,
): data is VideoModuleType {
  return data !== null && Array.isArray(data.videos) && data.videos.length > 0;
}

export function VideoModule({ data }: { data: VideoModuleType | null }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const multiVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hasPlayedVideos, setHasPlayedVideos] = useState<Set<number>>(
    new Set(),
  );

  // Use video controls hook ONLY for single video case
  const singleVideoControls = useVideoControls({ stopOthersOnPlay: true });

  // Memoize videos to prevent effect dependency issues
  const videos = useMemo(() => data?.videos || [], [data?.videos]);
  const count = videos.length;

  // Intersection Observer for multi-video scroll-triggered playback
  useEffect(() => {
    if (count <= 1) return;

    const STAGGER_DELAY = 500; // ms between each video start

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(
            entry.target.getAttribute('data-video-index') || '0',
            10,
          );
          const video = multiVideoRefs.current[index];

          if (!video) return;

          if (entry.isIntersecting) {
            // Play when scrolled into view
            if (!hasPlayedVideos.has(index)) {
              setTimeout(() => {
                video.play().catch((err: Error) => {
                  console.error(`Failed to autoplay video ${index}:`, err);
                });
                setHasPlayedVideos((prev) => new Set(prev).add(index));
              }, index * STAGGER_DELAY);
            } else {
              // Already played before, just resume
              video.play().catch((err: Error) => {
                console.error(`Failed to play video ${index}:`, err);
              });
            }
          } else {
            // Pause when scrolled out of view
            video.pause();
          }
        });
      },
      {
        threshold: 0.5, // Play when 50% of video is visible
        rootMargin: '0px',
      },
    );

    // Observe all video containers
    containerRefs.current.forEach((container) => {
      if (container) {
        observer.observe(container);
      }
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [count, videos, hasPlayedVideos]);

  // Guard: Early return if no valid data
  if (!isValidVideoModule(data)) return null;

  // Single Video: Play inline with controls
  if (count === 1) {
    const v = videos[0];
    const {
      videoRef,
      muted,
      isPaused,
      handlePlay,
      handlePause,
      handleTogglePlay,
      handleToggleMute,
    } = singleVideoControls;

    return (
      <div style={{ position: 'relative' }} className="container single-video">
        {!isPlaying ? (
          <VideoPoster
            title={v.title || ''}
            poster={v.poster}
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

  // Multiple Videos: Autoplay inline with reserved space
  return (
    <div className="container multi-video">
      {videos.map((v, i) => {
        // Get aspect ratio from Mux video data
        const videoAsset = v.video?.asset as unknown as
          | MuxVideoAsset
          | undefined;
        const aspectRatio = videoAsset?.data?.aspect_ratio
          ? parseAspectRatio(videoAsset.data.aspect_ratio)
          : '16/9'; // fallback

        return (
          <div
            key={v._key || i}
            ref={(el) => {
              containerRefs.current[i] = el;
            }}
            data-video-index={i}
            className="row video-item"
            style={{
              position: 'relative',
              aspectRatio,
              backgroundColor: '#000',
            }}
          >
            <MuxVideo
              ref={(el) => {
                multiVideoRefs.current[i] = el;
              }}
              videoItem={v}
              autoPlay={false}
              muted
              loop
            />
          </div>
        );
      })}
    </div>
  );
}
