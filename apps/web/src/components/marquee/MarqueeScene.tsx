'use client';

import Preloader from '@/components/common/Preloader';
import { VideoModal } from '@/components/modules/Video/VideoModal';
import type { VideoItem } from '@/types/sanity.generated';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Scene = dynamic(() => import('@/components/model/Scene'), { ssr: false });

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
