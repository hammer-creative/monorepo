// apps/web/src/components/Video/VideoControls.tsx
import {
  CloseIcon,
  PauseIcon,
  PlayIcon,
  VolumeOffIcon,
  VolumeOnIcon,
} from './VideoIcons';

interface PlayButtonProps {
  withLabel?: boolean;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function PlayButton({
  withLabel = false,
  label = 'Play',
  onClick,
  className,
}: PlayButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label="Play"
    >
      <PlayIcon />
      {withLabel && <span>{label}</span>}
    </button>
  );
}

interface PauseButtonProps {
  onClick?: () => void;
  className?: string;
  paused?: boolean;
}

export function PauseButton({
  onClick,
  className,
  paused = false,
}: PauseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label={paused ? 'Play' : 'Pause'}
    >
      {paused ? <PlayIcon /> : <PauseIcon />}
    </button>
  );
}

interface CloseButtonProps {
  onClick?: () => void;
  className?: string;
}

export function CloseButton({ onClick, className }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label="Close"
    >
      <CloseIcon />
    </button>
  );
}

interface MuteButtonProps {
  muted: boolean;
  onToggle: () => void;
  className?: string;
}

export function MuteButton({ muted, onToggle, className }: MuteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={className}
      aria-label={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
    </button>
  );
}
