// apps/web/src/components/Video/MuxVideo.tsx
'use client';

import { urlFor } from '@/lib/sanity/image';
import type { VideoItem } from '@/types/sanity.generated';
import dynamic from 'next/dynamic';
import { forwardRef, useCallback, useRef } from 'react';
import { parseAspectRatio } from './utils';

// apps/web/src/components/Video/MuxVideo.tsx

const MuxVideoElement = dynamic(() => import('@mux/mux-video-react'), {
  ssr: false,
});

interface MuxVideoProps {
  videoItem: VideoItem;
  autoPlay?: boolean;
  priority?: boolean;
  muted?: boolean;
  onEnded?: () => void;
}

export const MuxVideo = forwardRef<HTMLVideoElement, MuxVideoProps>(
  (
    { videoItem, autoPlay = false, priority = false, muted = false, onEnded },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLVideoElement | null>(null);

    const setRefs = useCallback(
      (element: any) => {
        const videoElement = element?.el || element;
        internalRef.current = videoElement;

        if (typeof forwardedRef === 'function') {
          forwardedRef(videoElement);
        } else if (forwardedRef) {
          forwardedRef.current = videoElement;
        }
      },
      [forwardedRef],
    );

    const { video, title, poster } = videoItem;
    const videoAsset = video?.asset as any;

    if (!videoAsset?.playbackId) {
      console.warn('MuxVideo: missing video playbackId');
      return null;
    }

    const aspectRatio = parseAspectRatio(videoAsset.aspectRatio);
    const posterUrl = poster?.asset
      ? urlFor(poster).auto('format').url()
      : undefined;

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio,
        }}
      >
        <MuxVideoElement
          ref={setRefs}
          playbackId={videoAsset.playbackId}
          streamType="on-demand"
          playsInline
          autoPlay={autoPlay}
          muted={muted}
          preload={priority ? 'auto' : 'metadata'}
          poster={posterUrl}
          onEnded={onEnded}
          title={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    );
  },
);

MuxVideo.displayName = 'MuxVideo';
