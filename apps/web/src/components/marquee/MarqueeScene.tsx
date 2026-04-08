'use client';

import Preloader from '@/components/common/Preloader';
import Scene from '@/components/model/Scene';
import { VideoModal } from '@/components/modules/Video/VideoModal';
import type { VideoItem } from '@/types/sanity.generated';
import { useEffect, useState } from 'react';

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log('progress changed', progress);
  }, [progress]);

  return (
    <>
      <Preloader progress={progress} />
      <Scene onPlayClick={() => setModalOpen(true)} onProgress={setProgress} />
      <VideoModal
        videoItem={HOME_VIDEO}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
