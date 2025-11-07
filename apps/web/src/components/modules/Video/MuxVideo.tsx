// components/MuxVideo.tsx
import type { MuxVideo as MuxVideoType } from '@/types/sanity';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), {
  ssr: false,
});

interface MuxVideoProps {
  video: MuxVideoType;
  title: string;
  autoPlay?: boolean;
  priority?: boolean;
  posterGif?: string; // Path to animated GIF
}

export function MuxVideo({
  video,
  title,
  autoPlay = false,
  priority = false,
  posterGif = '/placeholder.gif',
}: MuxVideoProps) {
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGif, setShowGif] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handlePlay = async () => {
    setShowGif(false);

    try {
      if (playerRef.current) {
        await playerRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      try {
        const videoEl = playerRef.current?.shadowRoot?.querySelector('video');
        if (videoEl) {
          await videoEl.play();
          setIsPlaying(true);
        }
      } catch (fallbackError) {
        console.error('Play failed:', fallbackError);
      }
    }
  };

  if (!video?.playbackId) return null;

  const posterUrl = `https://image.mux.com/${video.playbackId}/thumbnail.jpg?time=1`;

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
      ref={containerRef}
      className="mux-video-container"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
    >
      {showGif && !autoPlay ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={posterGif}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <button
            onClick={handlePlay}
            type="button"
            aria-label={`Play ${title}`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'white',
              fontSize: '1rem',
            }}
          >
            Play
          </button>
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: shouldLoad ? 'block' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {shouldLoad ? (
            <MuxPlayer
              ref={playerRef}
              playbackId={video.playbackId}
              streamType="on-demand"
              playsInline
              nohotkeys
              autoPlay={!showGif}
              muted={autoPlay}
              preload={priority ? 'auto' : 'metadata'}
              poster={posterUrl}
              metadata={{ video_title: title }}
              style={
                {
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'cover',
                  '--controls': 'none',
                } as React.CSSProperties
              }
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <VideoPlaceholder />
          )}
        </div>
      )}
    </div>
  );
}

function VideoPlaceholder() {
  return (
    <div
      className="video-placeholder"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle
          cx="32"
          cy="32"
          r="30"
          stroke="white"
          strokeWidth="2"
          opacity="0.3"
        />
        <path d="M26 20L44 32L26 44V20Z" fill="white" opacity="0.3" />
      </svg>
    </div>
  );
}
