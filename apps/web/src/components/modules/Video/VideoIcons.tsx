// apps/web/src/components/Video/VideoIcons.tsx
export function PlayIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 25.5 17.32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.5 8.66016L-8.15666e-07 17.3204L-5.85622e-08 -9.83894e-05L25.5 8.66016Z"
        fill="#FFCC98"
      />
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L12 13.41l-4.89 4.88-1.41-1.41L10.59 12 4.3 5.71 5.71 4.3 12 10.59l6.29-6.3z"
      />
    </svg>
  );
}

export function VolumeOnIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M3 10v4h4l5 5V5L7 10H3zm11.5 2a4.5 4.5 0 00-2.12-3.84l-.88.88A3.3 3.3 0 0114.2 12c0 1.13-.56 2.13-1.4 2.96l.88.88A4.5 4.5 0 0014.5 12z"
      />
    </svg>
  );
}

export function VolumeOffIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" d="M3 10v4h4l5 5V5L7 10H3z" />
      <path
        fill="currentColor"
        d="M16.24 7.76L14.83 9.17 16.66 11l-1.83 1.83 1.41 1.41L18.07 12l1.83 1.83 1.41-1.41L19.49 11l1.82-1.83-1.41-1.41L18.07 9.59z"
      />
    </svg>
  );
}
