'use client';

import { useVideoControls } from '@/hooks/useVideoControls';
import type { VideoItem } from '@/types/sanity.generated';
import * as Dialog from '@radix-ui/react-dialog';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { animate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { MuxVideo } from './MuxVideo';
import { CloseButton, MuteButton, PauseButton } from './VideoControls';
import { VideoProgressBar } from './VideoProgressBar';

const ANIMATION = {
  overlay: {
    duration: 0.5,
    ease: 'easeOut' as const,
    easeIn: 'easeIn' as const,
  },
  video: {
    duration: 0.4,
    ease: 'easeOut' as const,
  },
} as const;

interface VideoModalProps {
  videoItem: VideoItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoModal({ videoItem, open, onOpenChange }: VideoModalProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const {
    videoRef,
    muted,
    isPaused,
    handlePlay,
    handlePause,
    handleTogglePlay,
    handleToggleMute,
  } = useVideoControls();

  const handleOpen = async () => {
    if (!overlayRef.current || !contentRef.current) return;

    contentRef.current.style.opacity = '0';
    overlayRef.current.style.transformOrigin = 'top';

    await animate(
      overlayRef.current,
      { scaleY: [0, 1] },
      { duration: ANIMATION.overlay.duration, ease: ANIMATION.overlay.ease },
    );

    await animate(
      contentRef.current,
      { opacity: [0, 1] },
      { duration: ANIMATION.video.duration, ease: ANIMATION.video.ease },
    );

    videoRef.current?.play();
  };

  const handleClose = async () => {
    if (!overlayRef.current || !contentRef.current || isAnimating.current)
      return;
    isAnimating.current = true;

    videoRef.current?.pause();

    await animate(
      contentRef.current,
      { opacity: [1, 0] },
      { duration: ANIMATION.video.duration, ease: ANIMATION.overlay.easeIn },
    );

    await animate(
      overlayRef.current,
      { scaleY: [1, 0] },
      { duration: ANIMATION.overlay.duration, ease: ANIMATION.overlay.easeIn },
    );

    isAnimating.current = false;
    setShouldRender(false);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open && !shouldRender) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          handleOpen();
        });
      });
    } else if (!open && shouldRender) {
      handleClose();
    }
  }, [open]);

  if (!shouldRender) return null;

  return (
    <Dialog.Root
      modal={true}
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose();
      }}
    >
      <Dialog.Portal>
        <div
          ref={overlayRef}
          className="video-modal"
          style={{ transformOrigin: 'top' }}
          onClick={handleClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleClose();
          }}
          role="button"
          tabIndex={0}
          aria-label="Close video"
        />
        <Dialog.Content
          ref={contentRef}
          className="video-modal-content"
          onClick={handleTogglePlay}
          onPointerDownOutside={(e) => {
            e.preventDefault();
            handleClose();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            handleClose();
          }}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>Video</Dialog.Title>
          </VisuallyHidden.Root>

          <MuxVideo
            ref={videoRef}
            videoItem={videoItem}
            autoPlay={false}
            muted={muted}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleClose}
          />

          <div
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            role="presentation"
          >
            <CloseButton className="video-modal-close" onClick={handleClose} />
            <PauseButton
              className="video-modal-play"
              onClick={handleTogglePlay}
              paused={isPaused}
            />
            <MuteButton
              className="video-modal-volume"
              muted={muted}
              onToggle={handleToggleMute}
            />
            <VideoProgressBar
              videoElement={videoRef.current}
              className="video-modal-progress"
            />
          </div>
          <VideoProgressBar
            videoElement={videoRef.current}
            className="video-modal-progress"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
