// apps/web/src/components/Video/MuxVideo.tsx
'use client';

import type { MuxVideoAsset } from '@/types';
import dynamic from 'next/dynamic';
import { forwardRef, useCallback, useRef } from 'react';
import { parseAspectRatio } from './utils';

// apps/web/src/components/Video/MuxVideo.tsx

// apps/web/src/components/Video/MuxVideo.tsx

const MuxVideoElement = dynamic(() => import('@mux/mux-video-react'), {
  ssr: false,
});

interface MuxVideoProps {
  video: MuxVideoAsset;
  title: string;
  posterUrl?: string;
  autoPlay?: boolean;
  priority?: boolean;
  muted?: boolean;
  onEnded?: () => void;
}

export const MuxVideo = forwardRef<HTMLVideoElement, MuxVideoProps>(
  (
    {
      video,
      title,
      posterUrl,
      autoPlay = false,
      priority = false,
      muted = false,
      onEnded,
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<any>(null);

    const setRefs = useCallback(
      (element: any) => {
        // Get the actual video element
        const videoElement = element?.el || element;

        // Set internal ref
        internalRef.current = videoElement;

        // Set forwarded ref
        if (typeof forwardedRef === 'function') {
          forwardedRef(videoElement);
        } else if (forwardedRef) {
          forwardedRef.current = videoElement;
        }

        console.log('MuxVideo ref set to:', videoElement);
      },
      [forwardedRef],
    );

    if (!video?.playbackId) return null;

    const aspectRatio = parseAspectRatio(video.aspectRatio);

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
          playbackId={video.playbackId}
          streamType="on-demand"
          playsInline
          autoPlay={autoPlay}
          muted={muted}
          preload={priority ? 'auto' : 'metadata'}
          poster={posterUrl}
          onEnded={onEnded}
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
