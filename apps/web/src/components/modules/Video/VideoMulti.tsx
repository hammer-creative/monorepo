// apps/web/src/components/modules/Video/VideoMulti.tsx

import type { VideoItem } from '@/types/sanity.generated';

import { useScrollTriggeredVideo } from './hooks/useScrollTriggeredVideo';
import { MuxVideo } from './MuxVideo';
import { parseAspectRatio } from './utils';

interface VideoMultiProps {
  videos: (VideoItem & { _key?: string })[];
}

interface MuxVideoAssetData {
  data?: {
    aspect_ratio?: string;
  };
}

export function VideoMulti({ videos }: VideoMultiProps) {
  const { videoRefs, containerRefs } = useScrollTriggeredVideo({
    enabled: true,
    videoCount: videos.length,
  });

  return (
    <div className="container multi-video">
      {videos.map((v, i) => {
        const videoAsset = v.video?.asset as MuxVideoAssetData | undefined;
        const aspectRatio = videoAsset?.data?.aspect_ratio
          ? parseAspectRatio(videoAsset.data.aspect_ratio)
          : '16/9';

        return (
          <div
            key={v._key || i}
            ref={(el) => {
              containerRefs.current[i] = el;
            }}
            data-video-index={i}
            className="row video-item"
            style={{
              position: 'relative',
              aspectRatio,
              backgroundColor: '#000',
            }}
          >
            <MuxVideo
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              videoItem={v}
              autoPlay={false}
              muted
              loop
            />
          </div>
        );
      })}
    </div>
  );
}
