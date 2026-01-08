// apps/web/src/components/Video/VideoPoster.tsx
import {
  SanityVideoPosterImage,
  type SanityImageType,
} from '@/components/common/SanityImage';

export function VideoPoster({
  poster = null,
  title = '',
  onClick,
}: {
  poster?: SanityImageType | null;
  title?: string;
  onClick: () => void;
}) {
  // Guard: Early return if no poster image
  if (!poster?.asset) return null;

  return (
    <button
      onClick={onClick}
      className="video-poster"
      type="button"
      aria-label={title || 'Play video'}
    >
      {/* Poster Image */}
      <SanityVideoPosterImage image={poster} />

      {/* Play Button Overlay */}
      <div className="poster-play-button">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.5" />
          <path d="M26 20L44 32L26 44V20Z" fill="white" />
        </svg>
      </div>
    </button>
  );
}
