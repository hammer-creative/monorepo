// apps/web/src/components/modules/Video/VideoModule.ts
import type { MultiVideoModuleType } from '@/types/sanity';
import { useState } from 'react';
import { MuxVideo } from './MuxVideo';
import { VideoModal } from './VideoModal';
import { VideoThumbnail } from './VideoThumbnail';

function getPosterUrl(v: any) {
  return v.poster?.url || '';
}

export function VideoModule({ data }: { data: MultiVideoModuleType }) {
  const videos = data.videos || [];
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const count = videos.length;
  if (count === 0) return null;

  // --- Single Video (inline full-width) ---
  if (count === 1) {
    const v = videos[0];
    return (
      <>
        <MuxVideo
          video={v.video}
          title={v.title}
          posterUrl={getPosterUrl(v)}
          priority
        />
      </>
    );
  }

  // --- Multiple Videos (flex layout + modal) ---
  return (
    <>
      {data.heading && <h2>{data.heading}</h2>}

      <div className="multi-video-flex">
        {videos.map((v, i) => (
          <div key={v._key || i} className="multi-video-item">
            <VideoThumbnail
              video={v.video}
              title={v.title}
              posterUrl={getPosterUrl(v)}
              onClick={() => setActiveVideo(i)}
            />
          </div>
        ))}
      </div>

      {activeVideo !== null && (
        <VideoModal
          video={videos[activeVideo].video}
          title={videos[activeVideo].title}
          description={videos[activeVideo].description}
          open
          onOpenChange={(open) => !open && setActiveVideo(null)}
        />
      )}
    </>
  );
}
