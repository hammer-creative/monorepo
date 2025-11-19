// apps/web/src/components/Video/VideoPoster.tsx
import type { MuxVideo } from '@/types/sanity';

interface VideoPosterProps {
  video: MuxVideo;
  title: string;
  posterUrl?: string;
  onClick: () => void;
}

export function VideoPoster({
  video,
  title,
  posterUrl,
  onClick,
}: VideoPosterProps) {
  const src =
    posterUrl ||
    (video?.playbackId
      ? `https://image.mux.com/${video.playbackId}/thumbnail.jpg?fit_mode=smartcrop`
      : '');

  if (!src) return null;

  return (
    <button onClick={onClick} className="video-poster" type="button">
      <img
        src={src}
        alt={title}
        loading="lazy"
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          display: 'block',
          borderRadius: '4px',
        }}
      />
      <div className="video-poster-play-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.5" />
          <path d="M26 20L44 32L26 44V20Z" fill="white" />
        </svg>
      </div>
    </button>
  );
}
