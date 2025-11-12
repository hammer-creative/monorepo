// apps/web/src/components/Video/MuxVideo.tsx
import type { MuxVideo as MuxVideoType } from '@/types/sanity';
import dynamic from 'next/dynamic';

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
});

interface MuxVideoProps {
  video: MuxVideoType;
  title: string;
  posterUrl?: string;
  autoPlay?: boolean;
  priority?: boolean;
}

export function MuxVideo({
  video,
  title,
  posterUrl,
  autoPlay = false,
  priority = false,
}: MuxVideoProps) {
  if (!video?.playbackId) return null;

  const aspectRatio = (() => {
    const ratio = video.aspectRatio;
    if (typeof ratio === 'string' && ratio.includes(':')) {
      const [w, h] = ratio.split(':').map(Number);
      return w && h ? `${w} / ${h}` : '16 / 9';
    }
    return ratio || '16 / 9';
  })();

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
        muted={autoPlay}
        preload={priority ? 'auto' : 'metadata'}
        poster={posterUrl}
        metadata={{ video_title: title }}
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
}
