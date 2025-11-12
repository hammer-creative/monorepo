// apps/web/src/components/Video/SingleVideoModule.tsx
import type { VideoModuleType } from '@/types/sanity';
import { MuxVideo } from './MuxVideo';

export function SingleVideoModule({
  data,
  priority = false,
}: {
  data: VideoModuleType;
  priority?: boolean;
}) {
  const video = data.videos?.[0];

  if (!video) return null;

  return (
    <section className="single-video-module">
      <MuxVideo video={video.video} title={video.title} priority={priority} />
    </section>
  );
}
