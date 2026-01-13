// apps/web/src/hooks/useVideoControls.ts
import { useRef, useState } from 'react';

let currentlyPlayingVideo: HTMLVideoElement | null = null;

export function useVideoControls(options?: { stopOthersOnPlay?: boolean }) {
  const [muted, setMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stopOthersOnPlay = options?.stopOthersOnPlay ?? false;

  const handlePlay = () => {
    setIsPaused(false);

    // Only manage global playback if this video opts in
    if (stopOthersOnPlay) {
      // Pause the currently playing video if it's not this one
      if (currentlyPlayingVideo && currentlyPlayingVideo !== videoRef.current) {
        currentlyPlayingVideo.pause();
        // currentlyPlayingVideo.currentTime = 0;
      }

      currentlyPlayingVideo = videoRef.current;
    }
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
