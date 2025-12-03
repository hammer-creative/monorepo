interface LogoProps {
  fill?: string;
  className?: string;
}

export function EaIcon({ fill = 'currentColor', className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 85 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M58.4395 0L37.6649 32.838H14.8977L20.1446 24.76H34.308L39.4492 16.5777H7.86957L2.72844 24.76H10.2823L0 41.0219H42.3876L58.4395 15.4234L64.3149 24.76H59.278L54.1383 32.838H69.456L74.5971 41.0219H84.3537L58.4395 0Z"
        fill={fill}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M51.6199 0.313965H18.1519L13.0107 8.4978L46.4788 8.39363L51.6199 0.313965Z"
        fill={fill}
      />
    </svg>
  );
}
