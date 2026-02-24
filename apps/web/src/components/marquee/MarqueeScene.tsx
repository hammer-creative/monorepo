// apps/web/src/components/modules/Marquee/MarqueeScene.tsx
'use client';

import Scene from '@/components/model/Scene';
import { VideoModal } from '@/components/modules/Video/VideoModal';
import type { VideoItem } from '@/types/sanity.generated';
import { useState } from 'react';

const HOME_VIDEO = {
  _type: 'videoItem',
  video: {
    asset: {
      playbackId: 'D7873s6vpqJd01NXNlttmcaWQ6mrybBsiUeVN65pYyrI',
    },
  },
} as unknown as VideoItem;

export function MarqueeScene() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Scene onPlayClick={() => setModalOpen(true)} />
      <VideoModal
        videoItem={HOME_VIDEO}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
