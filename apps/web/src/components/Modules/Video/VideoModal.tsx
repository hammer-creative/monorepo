// apps/web/src/components/Video/Modal.tsx
import type { MuxVideo as MuxVideoType } from '@/types/sanity';
import * as Dialog from '@radix-ui/react-dialog';
import { MuxVideo } from './MuxVideo';

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
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="video-modal-overlay" />
        <Dialog.Content className="video-modal-content">
          <Dialog.Close className="video-modal-close" aria-label="Close">
            ×
          </Dialog.Close>

          <MuxVideo video={video} title={title} priority autoPlay />

          {(title || description) && (
            <div className="video-modal-info">
              <Dialog.Title>{title}</Dialog.Title>
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
