// apps/web/src/components/Video/MultiVideoModule.tsx
import type { VideoModuleType } from '@/types/sanity';
import { useState } from 'react';
import { VideoModal } from './VideoModal';
import { VideoThumbnail } from './VideoThumbnail';

export function MultiVideoModule({ data }: { data: VideoModuleType }) {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  return (
    <section className="multi-video-module">
      <div className="multi-video-grid">
        {data.videos.map((item, index) => (
          <div key={item._key} className="multi-video-item">
            <VideoThumbnail
              video={item.video}
              title={item.title}
              onClick={() => setActiveVideo(index)}
            />
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>

      {activeVideo !== null && (
        <VideoModal
          video={data.videos[activeVideo].video}
          title={data.videos[activeVideo].title}
          open={activeVideo !== null}
          onOpenChange={(open) => !open && setActiveVideo(null)}
        />
      )}
    </section>
  );
}
