// apps/web/src/components/Video/VideoProgressBar.tsx
import { useEffect, useRef, useState } from 'react';

interface VideoProgressBarProps {
  videoElement: HTMLVideoElement | null;
  className?: string;
}

export function VideoProgressBar({
  videoElement,
  className,
}: VideoProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoElement) {
      console.log('VideoProgressBar: waiting for video element');
      return;
    }

    console.log('VideoProgressBar: video element ready');

    const updateProgress = () => {
      const { currentTime, duration } = videoElement;
      if (duration > 0) {
        const newProgress = (currentTime / duration) * 100;
        setProgress(newProgress);
      }
    };

    const updateBuffered = () => {
      if (videoElement.buffered.length > 0) {
        const bufferedEnd = videoElement.buffered.end(
          videoElement.buffered.length - 1,
        );
        const { duration } = videoElement;
        if (duration > 0) {
          const newBuffered = (bufferedEnd / duration) * 100;
          setBuffered(newBuffered);
        }
      }
    };

    videoElement.addEventListener('timeupdate', updateProgress);
    videoElement.addEventListener('progress', updateBuffered);
    videoElement.addEventListener('loadedmetadata', updateProgress);

    // Initial update
    updateProgress();
    updateBuffered();

    return () => {
      videoElement.removeEventListener('timeupdate', updateProgress);
      videoElement.removeEventListener('progress', updateBuffered);
      videoElement.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [videoElement]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoElement || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * videoElement.duration;

    videoElement.currentTime = newTime;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' && videoElement) {
      e.preventDefault();
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  };

  return (
    <div
      ref={progressBarRef}
      className={className}
      tabIndex={0}
      onClick={handleSeek}
      onKeyDown={handleKeyDown}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="video-progress-buffered"
        style={{
          width: `${buffered}%`,
        }}
      />
      <div
        className="video-progress-bar"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}
