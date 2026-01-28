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

// Extended HTMLVideoElement type with custom listener property
interface VideoElementWithListener extends HTMLVideoElement {
  _timeUpdateListener?: () => void;
}

export function VideoModule({ data }: { data: VideoModuleType | null }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const multiVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [overlayOpacity, setOverlayOpacity] = useState<Record<number, number>>(
    {},
  );

  // Use video controls hook ONLY for single video case
  const singleVideoControls = useVideoControls({ stopOthersOnPlay: true });

  // Memoize videos to prevent effect dependency issues
  const videos = useMemo(() => data?.videos || [], [data?.videos]);
  const count = videos.length;

  // Intersection Observer for multi-video scroll-triggered playback
  useEffect(() => {
    if (count <= 1) return;

    const STAGGER_DELAY = 500;
    const playedVideos = new Set<number>();

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
            if (!playedVideos.has(index)) {
              setTimeout(() => {
                video.play().catch((err: Error) => {
                  console.error(`Failed to autoplay video ${index}:`, err);
                });
                playedVideos.add(index);
              }, index * STAGGER_DELAY);
            } else {
              video.play().catch((err: Error) => {
                console.error(`Failed to play video ${index}:`, err);
              });
            }
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px',
      },
    );

    // Observe all video containers
    containerRefs.current.forEach((container) => {
      if (container) {
        observer.observe(container);
      }
    });

    // Check for videos already in viewport on mount
    setTimeout(() => {
      containerRefs.current.forEach((container, index) => {
        if (container) {
          const rect = container.getBoundingClientRect();
          const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

          if (isInViewport && !playedVideos.has(index)) {
            const video = multiVideoRefs.current[index];
            if (video) {
              setTimeout(() => {
                video.play().catch((err: Error) => {
                  console.error(`Failed to autoplay video ${index}:`, err);
                });
                playedVideos.add(index);
              }, index * STAGGER_DELAY);
            }
          }
        }
      });
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, [count, videos]);

  // Handle overlay fade effect
  useEffect(() => {
    if (count <= 1) return;

    const FADE_DURATION = 0.5;

    // Copy the current refs to a local variable for the cleanup function
    const currentVideoRefs = multiVideoRefs.current;

    currentVideoRefs.forEach((video, index) => {
      if (!video) return;

      const handleTimeUpdate = () => {
        if (!video.duration) return;

        const timeRemaining = video.duration - video.currentTime;

        // Fade to black when near end
        if (timeRemaining <= FADE_DURATION) {
          const opacity = 1 - timeRemaining / FADE_DURATION;
          setOverlayOpacity((prev) => ({ ...prev, [index]: opacity }));
        }
        // Fade from black at start
        else if (video.currentTime <= FADE_DURATION) {
          const opacity = 1 - video.currentTime / FADE_DURATION;
          setOverlayOpacity((prev) => ({ ...prev, [index]: opacity }));
        }
        // No overlay
        else {
          setOverlayOpacity((prev) => {
            if (prev[index] !== 0) {
              return { ...prev, [index]: 0 };
            }
            return prev;
          });
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      (video as VideoElementWithListener)._timeUpdateListener =
        handleTimeUpdate;
    });

    return () => {
      currentVideoRefs.forEach((video) => {
        const videoWithListener = video as VideoElementWithListener | null;
        if (videoWithListener?._timeUpdateListener) {
          videoWithListener.removeEventListener(
            'timeupdate',
            videoWithListener._timeUpdateListener,
          );
        }
      });
    };
  }, [count, videos]);

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
            <PauseButton
              className="video-modal-pause"
              onClick={handleTogglePlay}
              paused={isPaused}
            />

            <MuteButton
              className="video-modal-mute"
              muted={muted}
              onToggle={handleToggleMute}
            />

            <MuxVideo
              ref={videoRef}
              videoItem={v}
              autoPlay
              priority
              muted={muted}
              onPlay={handlePlay}
              onPause={handlePause}
            />

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
        const videoAsset = v.video?.asset as unknown as
          | MuxVideoAsset
          | undefined;
        const aspectRatio = videoAsset?.data?.aspect_ratio
          ? parseAspectRatio(videoAsset.data.aspect_ratio)
          : '16/9';

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
            {/* Black overlay for fade effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#000',
                opacity: overlayOpacity[i] ?? 0,
                pointerEvents: 'none',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
