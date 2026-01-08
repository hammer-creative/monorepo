// apps/web/src/components/Video/MuxVideo.tsx
'use client';

import { urlFor } from '@/lib/sanity/image';
import type { MuxVideoAsset, VideoItem } from '@/types/sanity.generated';
import dynamic from 'next/dynamic';
import { forwardRef, useCallback, useRef } from 'react';

import { parseAspectRatio } from './utils';

const MuxVideoElement = dynamic(() => import('@mux/mux-video-react'), {
  ssr: false,
});

interface MuxVideoProps {
  videoItem: VideoItem;
  autoPlay?: boolean;
  priority?: boolean;
  muted?: boolean;
  loop?: boolean;
  onEnded?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onLoadedMetadata?: () => void;
}

// Type guard: Check if video item has required playback data
function hasValidPlaybackId(videoItem: VideoItem): boolean {
  const asset = videoItem.video?.asset as unknown as MuxVideoAsset | undefined;
  return Boolean(asset?.playbackId);
}

export const MuxVideo = forwardRef<HTMLVideoElement, MuxVideoProps>(
  (
    {
      videoItem,
      autoPlay = false,
      priority = false,
      muted = false,
      loop = false,
      onEnded,
      onPlay,
      onPause,
      onLoadedMetadata,
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLVideoElement | null>(null);

    const setRefs = useCallback(
      (
        element: HTMLVideoElement | { el: HTMLVideoElement } | null | undefined,
      ) => {
        if (!element) {
          internalRef.current = null;
          if (typeof forwardedRef === 'function') {
            forwardedRef(null);
          } else if (forwardedRef) {
            forwardedRef.current = null;
          }
          return;
        }

        const videoElement = 'el' in element ? element.el : element;
        internalRef.current = videoElement;

        if (typeof forwardedRef === 'function') {
          forwardedRef(videoElement);
        } else if (forwardedRef) {
          forwardedRef.current = videoElement;
        }
      },
      [forwardedRef],
    );

    // Guard: Early return if no valid playback ID
    if (!hasValidPlaybackId(videoItem)) {
      console.warn('MuxVideo: missing video playbackId');
      return null;
    }

    // Destructure video data
    const { video, title, poster } = videoItem;

    // Get the expanded video asset data
    const videoAsset = video?.asset as unknown as MuxVideoAsset;

    // Generate aspect ratio and poster URL
    const aspectRatio = parseAspectRatio(videoAsset?.data?.aspect_ratio);
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
          playbackId={videoAsset?.playbackId || ''}
          streamType="on-demand"
          playsInline
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          preload={priority ? 'auto' : 'metadata'}
          poster={posterUrl}
          onEnded={onEnded}
          onPlay={onPlay}
          onPause={onPause}
          onLoadedMetadata={onLoadedMetadata}
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
