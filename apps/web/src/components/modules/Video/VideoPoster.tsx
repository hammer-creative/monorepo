// apps/web/src/components/Video/VideoPoster.tsx
import {
  SanityImageVideoPoster,
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
      <SanityImageVideoPoster image={poster} />

      {/* Play Button Overlay */}
      <div className="poster-play-button">
        <svg
          width="113"
          height="78"
          viewBox="0 0 113 78"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="poster-play-svg"
          aria-hidden="true"
        >
          <path
            d="M112.5 38.9712L-3.6705e-06 77.9423L-2.6353e-07 4.46735e-05L112.5 38.9712Z"
            fill="currentColor"
          />
        </svg>
        <span className="poster-play-text">Play</span>
      </div>
    </button>
  );
}
