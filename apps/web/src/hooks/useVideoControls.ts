// apps/web/src/hooks/useVideoControls.ts
import { useRef, useState, useEffect } from 'react';

export function useVideoControls() {
  const [muted, setMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Reset this video when another video starts playing
  useEffect(() => {
    const handleOtherVideoPlay = (event: CustomEvent) => {
      if (event.detail.videoRef !== videoRef.current && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPaused(true);
      }
    };

    window.addEventListener('video-play' as any, handleOtherVideoPlay);
    return () => {
      window.removeEventListener('video-play' as any, handleOtherVideoPlay);
    };
  }, []);

  const handlePlay = () => {
    setIsPaused(false);
    // Broadcast that this video is playing
    window.dispatchEvent(
      new CustomEvent('video-play', { detail: { videoRef: videoRef.current } }),
    );
  };

  const handlePause = () => setIsPaused(true);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .catch((err: Error) => console.error('Play failed:', err));
    } else {
      videoRef.current.pause();
    }
  };

  const handleToggleMute = () => {
    setMuted((m) => !m);
  };

  return {
    videoRef,
    muted,
    isPaused,
    handlePlay,
    handlePause,
    handleTogglePlay,
    handleToggleMute,
  };
}
