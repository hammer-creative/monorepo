// apps/web/src/components/Video/VideoModal.tsx
'use client';

import { useVideoControls } from '@/hooks/useVideoControls';
import type { VideoItem } from '@/types/sanity.generated';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { MuxVideo } from './MuxVideo';
import { CloseButton, MuteButton, PauseButton } from './VideoControls';
import { VideoProgressBar } from './VideoProgressBar';

// apps/web/src/components/Video/VideoModal.tsx

interface VideoModalProps {
  videoItem: VideoItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoModal({ videoItem, open, onOpenChange }: VideoModalProps) {
  const { title } = videoItem;

  // Use video controls hook for play/pause/mute state
  const {
    videoRef,
    muted,
    isPaused,
    handlePlay,
    handlePause,
    handleTogglePlay,
    handleToggleMute,
  } = useVideoControls();

  const handleVideoEnded = () => {
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="video-modal" />

        <Dialog.Content className="video-modal-content">
          <VisuallyHidden.Root>
            <Dialog.Title>{title}</Dialog.Title>
          </VisuallyHidden.Root>

          {/* Close Button */}
          <CloseButton
            className="video-modal-close"
            onClick={() => onOpenChange(false)}
          />

          {/* Play/Pause Button */}
          <PauseButton
            className="video-modal-play"
            onClick={handleTogglePlay}
            paused={isPaused}
          />

          {/* Mute Button */}
          <MuteButton
            className="button video-modal-volume"
            muted={muted}
            onToggle={handleToggleMute}
          />

          {/* Video Player */}
          <MuxVideo
            ref={videoRef}
            videoItem={videoItem}
            autoPlay
            priority
            muted={muted}
            onEnded={handleVideoEnded}
            onPlay={handlePlay}
            onPause={handlePause}
          />

          {/* Progress Bar */}
          <VideoProgressBar
            videoElement={videoRef.current}
            className="video-modal-progress"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
