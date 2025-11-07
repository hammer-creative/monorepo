// apps/web/src/components/Video/SingleVideoModule.tsx
import type { SingleVideoModuleType } from '@/types/sanity';
import { MuxVideo } from './MuxVideo';

export function SingleVideoModule({
  data,
  priority = false,
}: {
  data: SingleVideoModuleType;
  priority?: boolean;
}) {
  return (
    <section className="single-video-module">
      <h2>{data.heading}</h2>
      {data.description && <p>{data.description}</p>}
      <MuxVideo video={data.video} title={data.heading} priority={priority} />
    </section>
  );
}
