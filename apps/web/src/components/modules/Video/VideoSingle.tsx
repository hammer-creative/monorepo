// apps/web/src/components/modules/Video/SingleVideo.tsx

import { useVideoControls } from '@/hooks/useVideoControls';
import type { VideoItem } from '@/types/sanity.generated';
import { useState } from 'react';

import { MuxVideo } from './MuxVideo';
import { MuteButton, PauseButton } from './VideoControls';
import { VideoPoster } from './VideoPoster';
import { VideoProgressBar } from './VideoProgressBar';

interface VideoSingleProps {
  video: VideoItem;
}

export function VideoSingle({ video }: VideoSingleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const {
    videoRef,
    muted,
    isPaused,
    handlePlay,
    handlePause,
    handleTogglePlay,
    handleToggleMute,
  } = useVideoControls({ stopOthersOnPlay: true });

  return (
    <div style={{ position: 'relative' }} className="container single-video">
      {!isPlaying ? (
        <VideoPoster
          title={video.title || ''}
          poster={video.poster}
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
            videoItem={video}
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
