// apps/web/src/components/Video/VideoModal.tsx
import type { MuxVideo as MuxVideoType } from '@/types/sanity';
import * as Dialog from '@radix-ui/react-dialog';
import { useRef, useState } from 'react';
import { MuxVideo } from './MuxVideo';
import { CloseButton, MuteButton, PauseButton } from './VideoControls';

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

  // Mux Player exposes control on the underlying <mux-player> element
  const videoRef = useRef<any>(null);

  const handlePause = () => {
    const host = videoRef.current;
    if (!host) return;

    // get the actual HTMLVideoElement inside mux-player
    const video = host.querySelector('video') as HTMLVideoElement | null;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="video-modal" />

        <Dialog.Content className="video-modal-content">
          <CloseButton
            className="video-modal-close"
            onClick={() => onOpenChange(false)}
          />

          {/* TOGGLE PLAY / PAUSE */}
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
            video={video}
            title={title}
            autoPlay
            priority
            muted={muted}
          />

          {(title || description) && (
            <div className="video-modal-info">
              {description && (
                <Dialog.Description>{description}</Dialog.Description>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
