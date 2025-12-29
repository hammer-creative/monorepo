// apps/web/src/components/Video/VideoModal.tsx
'use client';

import type { VideoItem } from '@/types/sanity.generated';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useEffect, useRef, useState } from 'react';
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
  const [muted, setMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { title } = videoItem;

  const handleVideoEnded = () => {
    console.log('Video ended, closing modal');
    onOpenChange(false);
  };

  // Sync paused state with video element
  useEffect(() => {
    const video = videoRef.current;
    console.log('useEffect - found video:', video);

    if (!video) {
      console.log('No video element found');
      return;
    }

    const handlePlay = () => {
      console.log('Video playing');
      setIsPaused(false);
    };

    const handlePause = () => {
      console.log('Video paused');
      setIsPaused(true);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [open]);

  const handlePause = () => {
    const video = videoRef.current;
    console.log('handlePause - found video:', video);

    if (!video) {
      console.log('No video element found');
      return;
    }

    console.log('Video paused state:', video.paused);

    if (video.paused) {
      console.log('Calling play()');
      video.play().catch((err: Error) => console.error('Play failed:', err));
    } else {
      console.log('Calling pause()');
      video.pause();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="video-modal" />

        <Dialog.Content className="video-modal-content" ref={containerRef}>
          <VisuallyHidden.Root>
            <Dialog.Title>{title}</Dialog.Title>
          </VisuallyHidden.Root>

          <CloseButton
            className="video-modal-close"
            onClick={() => onOpenChange(false)}
          />

          <PauseButton
            className="video-modal-play"
            onClick={handlePause}
            paused={isPaused}
          />

          <MuteButton
            className="button video-modal-volume"
            muted={muted}
            onToggle={() => setMuted((m) => !m)}
          />

          <MuxVideo
            ref={videoRef}
            videoItem={videoItem}
            autoPlay
            priority
            muted={muted}
            onEnded={handleVideoEnded}
          />

          <VideoProgressBar
            videoElement={videoRef.current}
            className="video-modal-progress"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
