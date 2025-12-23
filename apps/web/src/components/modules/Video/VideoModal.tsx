// apps/web/src/components/Video/VideoModal.tsx
'use client';

import type { MuxVideo as MuxVideoType } from '@/types/sanity';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useEffect, useRef, useState } from 'react';
import { MuxVideo } from './MuxVideo';
import { CloseButton, MuteButton, PauseButton } from './VideoControls';
import { VideoProgressBar } from './VideoProgressBar';

// apps/web/src/components/Video/VideoModal.tsx

interface VideoModalProps {
  video: MuxVideoType;
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoModal({
  video,
  title,
  description,
  open,
  onOpenChange,
}: VideoModalProps) {
  const [muted, setMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleVideoEnded = () => {
    console.log('Video ended, closing modal');
    onOpenChange(false);
  };

  // Get the actual video element from the DOM
  const getVideoElement = (): HTMLVideoElement | null => {
    if (!containerRef.current) return null;
    return containerRef.current.querySelector('video');
  };

  // Sync paused state with video element
  useEffect(() => {
    const video = getVideoElement();
    console.log('useEffect - found video:', video);

    if (!video) {
      console.log('No video element found in DOM');
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
    const video = getVideoElement();
    console.log('handlePause - found video:', video);

    if (!video) {
      console.log('No video element found');
      return;
    }

    console.log('Video paused state:', video.paused);

    if (video.paused) {
      console.log('Calling play()');
      video.play().catch((err) => console.error('Play failed:', err));
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

          {description && (
            <VisuallyHidden.Root>
              <Dialog.Description>{description}</Dialog.Description>
            </VisuallyHidden.Root>
          )}

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
            video={video}
            title={title}
            autoPlay
            priority
            muted={muted}
            onEnded={handleVideoEnded}
          />

          <VideoProgressBar
            videoElement={getVideoElement()}
            className="video-modal-progress"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
