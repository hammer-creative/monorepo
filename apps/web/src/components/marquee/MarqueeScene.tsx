'use client';

import Scene from '@/components/model/Scene';
import { VideoModal } from '@/components/modules/Video/VideoModal';
import type { VideoItem } from '@/types/sanity.generated';
import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

const HOME_VIDEO = {
  _type: 'videoItem',
  video: {
    asset: {
      playbackId: 'D7873s6vpqJd01NXNlttmcaWQ6mrybBsiUeVN65pYyrI',
    },
  },
} as unknown as VideoItem;

function LoadWatcher({ onReady }: { onReady: () => void }) {
  const { progress } = useProgress();
  useEffect(() => {
    if (progress === 100) onReady();
  }, [progress, onReady]);
  return null;
}

export function MarqueeScene() {
  const [modalOpen, setModalOpen] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {!ready && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            background: 'var(--color-sandstorm)',
            color: 'var(--color-nightshade)',
          }}
        >
          Loading
        </div>
      )}
      <Scene
        onPlayClick={() => setModalOpen(true)}
        loadWatcher={<LoadWatcher onReady={() => setReady(true)} />}
        ready={ready}
      />
      <VideoModal
        videoItem={HOME_VIDEO}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
