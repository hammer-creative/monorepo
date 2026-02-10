// apps/web/src/components/common/MenuArrow.tsx
interface ArrowProps {
  direction?: 'right' | 'down' | 'left' | 'up';
  className?: string;
}

export function MenuArrow({ direction = 'right', className }: ArrowProps) {
  const rotations = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  };

  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 63 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotations[direction]}deg)` }}
    >
      <rect x="2.00171" width="46" height="15" fill="currentColor" />
      <rect
        x="63.001"
        width="61"
        height="15"
        transform="rotate(90 63.001 0)"
        fill="currentColor"
      />
      <rect
        x="60.1846"
        y="14.3341"
        width="70.1072"
        height="15.0063"
        transform="rotate(135 60.1846 14.3341)"
        fill="currentColor"
      />
    </svg>
  );
}
