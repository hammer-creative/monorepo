// apps/web/src/components/Video/MultiVideoModule.tsx
import type { MultiVideoModuleType } from '@/types/sanity';
import { useState } from 'react';
import { VideoModal } from './VideoModal';
import { VideoThumbnail } from './VideoThumbnail';

export function MultiVideoModule({ data }: { data: MultiVideoModuleType }) {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  return (
    <section className="multi-video-module">
      <h2>{data.heading}</h2>

      <div className="multi-video-grid">
        {data.videos.map((item, index) => (
          <div key={index} className="multi-video-item">
            <VideoThumbnail
              video={item.video}
              title={item.title}
              onClick={() => setActiveVideo(index)}
            />
            <h3>{item.title}</h3>
            {item.description && <p>{item.description}</p>}
          </div>
        ))}
      </div>

      {activeVideo !== null && (
        <VideoModal
          video={data.videos[activeVideo].video}
          title={data.videos[activeVideo].title}
          description={data.videos[activeVideo].description}
          open={activeVideo !== null}
          onOpenChange={(open) => !open && setActiveVideo(null)}
        />
      )}
    </section>
  );
}
