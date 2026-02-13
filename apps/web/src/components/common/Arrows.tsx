// apps/web/src/components/common/Arrows.tsx
export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.274902" width="5.79529" height="1.83009" fill="currentColor" />
      <rect
        x="7.8999"
        width="7.62538"
        height="1.83009"
        transform="rotate(90 7.8999 0)"
        fill="currentColor"
      />
      <rect
        x="7.43896"
        y="1.77258"
        width="8.66543"
        height="1.85482"
        transform="rotate(135 7.43896 1.77258)"
        fill="currentColor"
      />
    </svg>
  );
}

// apps/web/src/components/common/ArrowDown.tsx
export function ArrowDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="97"
      height="111"
      viewBox="0 0 97 111"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.88102 53.9338L48.4128 93.6011L87.9446 53.7606L97 62.4588L48.414 111L0 62.6333L8.88102 53.9338ZM55.2053 0V100.039H41.6216V0L55.2053 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
