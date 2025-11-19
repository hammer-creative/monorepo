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
  const videoRef = useRef<any>(null);

  const handlePause = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="video-modal-overlay" />
        <Dialog.Content className="video-modal-content">
          <CloseButton
            className="video-modal-close"
            onClick={() => onOpenChange(false)}
          />

          <PauseButton className="video-modal-pause" onClick={handlePause} />

          <MuteButton
            className="video-modal-mute"
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
