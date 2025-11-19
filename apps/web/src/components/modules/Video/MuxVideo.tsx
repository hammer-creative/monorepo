// apps/web/src/components/Video/MuxVideo.tsx
import type { MuxVideo as MuxVideoType } from '@/types/sanity';
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import { parseAspectRatio } from './utils';

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
});

interface MuxVideoProps {
  video: MuxVideoType;
  title: string;
  posterUrl?: string;
  autoPlay?: boolean;
  priority?: boolean;
  muted?: boolean;
}

export const MuxVideo = forwardRef<any, MuxVideoProps>(
  (
    {
      video,
      title,
      posterUrl,
      autoPlay = false,
      priority = false,
      muted = false,
    },
    ref,
  ) => {
    if (!video?.playbackId) return null;

    const aspectRatio = parseAspectRatio(video.aspectRatio);

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio,
          backgroundColor: '#000',
          overflow: 'hidden',
        }}
      >
        <MuxPlayer
          playbackId={video.playbackId}
          streamType="on-demand"
          playsInline
          autoPlay={autoPlay}
          muted={muted}
          preload={priority ? 'auto' : 'metadata'}
          poster={posterUrl}
          metadata={{ video_title: title }}
          ref={ref}
          style={
            {
              width: '100%',
              height: '100%',
              display: 'block',
              '--media-object-fit': 'cover',
              '--media-object-position': 'center',
            } as React.CSSProperties
          }
        />
      </div>
    );
  },
);

MuxVideo.displayName = 'MuxVideo';
