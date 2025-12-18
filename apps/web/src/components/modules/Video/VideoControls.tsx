// apps/web/src/components/Video/VideoControls.tsx
import {
  PauseIcon,
  PlayIcon,
  CloseIcon,
  VolumeOnIcon,
  VolumeOffIcon,
} from './VideoIcons';

export function PlayButton({
  withLabel = false,
  label = 'Play',
  onClick,
  className,
}: {
  withLabel?: boolean;
  label?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button type="button" onClick={onClick} className={className}>
      <PlayIcon />
      {withLabel && <span>{label}</span>}
    </button>
  );
}

export function PauseButton({
  onClick,
  className,
  paused = false,
}: {
  onClick?: () => void;
  className?: string;
  paused?: boolean;
}) {
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

export function CloseButton({
  onClick,
  className,
}: {
  onClick?: () => void;
  className?: string;
}) {
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

export function MuteButton({
  muted,
  onToggle,
  className,
}: {
  muted: boolean;
  onToggle: () => void;
  className?: string;
}) {
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
