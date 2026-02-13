// apps/web/src/components/modules/Video/VideoSingle.tsx

import { useVideoControls } from '@/hooks/useVideoControls';
import type { VideoItem } from '@/types/sanity.generated';
import { useEffect, useState } from 'react';

import { MuxVideo } from './MuxVideo';
import { MuteButton, PauseButton } from './VideoControls';
import { VideoPoster } from './VideoPoster';
import { VideoProgressBar } from './VideoProgressBar';

interface VideoSingleProps {
  video: VideoItem;
  isInView: boolean;
}

export function VideoSingle({ video, isInView }: VideoSingleProps) {
  const [videoMounted, setVideoMounted] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const {
    videoRef,
    muted,
    isPaused,
    handlePlay,
    handlePause,
    handleTogglePlay,
    handleToggleMute,
  } = useVideoControls({ stopOthersOnPlay: true });

  // Pause video when scrolled out of view
  useEffect(() => {
    if (!videoRef.current || !videoMounted) return;

    if (!isInView) {
      videoRef.current.pause();
    }
  }, [isInView, videoMounted]);

  const handleVideoClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    handleTogglePlay();
  };

  const handleVideoKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleTogglePlay();
    }
  };

  const handlePosterClick = () => {
    setVideoMounted(true);
    requestAnimationFrame(() => {
      setShowPoster(false);
    });
  };

  const handleVideoEnded = () => {
    setShowPoster(true);
    setVideoMounted(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="container single-video">
      <div
        role="button"
        tabIndex={0}
        onClick={handleVideoClick}
        onKeyDown={handleVideoKeyDown}
        style={{ position: 'relative', cursor: 'pointer' }}
      >
        {videoMounted && (
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
              videoItem={video}
              autoPlay
              priority
              muted={muted}
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleVideoEnded}
            />

            <VideoProgressBar
              videoElement={videoRef.current}
              className="video-modal-progress"
            />
          </>
        )}

        <div
          style={{
            position: videoMounted ? 'absolute' : 'relative',
            top: 0,
            left: 0,
            width: '100%',
            opacity: showPoster ? 1 : 0,
            transition: 'opacity 400ms ease-out',
            pointerEvents: showPoster ? 'auto' : 'none',
          }}
        >
          <VideoPoster
            title={video.title || ''}
            poster={video.poster}
            onClick={handlePosterClick}
          />
        </div>
      </div>
    </div>
  );
}
