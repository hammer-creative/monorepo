// apps/web/src/components/Video/VideoThumbnail.tsx
import type { MuxVideo } from '@/types/sanity';

interface VideoThumbnailProps {
  video: MuxVideo;
  title: string;
  onClick: () => void;
}

export function VideoThumbnail({ video, title, onClick }: VideoThumbnailProps) {
  if (!video?.playbackId) return null;

  const thumbnailUrl = `https://image.mux.com/${video.playbackId}/thumbnail.jpg?width=640&fit_mode=smartcrop${video.thumbTime ? `&time=${video.thumbTime}` : ''}`;

  return (
    <button onClick={onClick} className="video-thumbnail" type="button">
      <img
        src={thumbnailUrl}
        alt={title}
        loading="lazy"
        width="640"
        height="360"
      />
      <div className="video-thumbnail-play-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.5" />
          <path d="M26 20L44 32L26 44V20Z" fill="white" />
        </svg>
      </div>
    </button>
  );
}
