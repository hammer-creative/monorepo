// apps/web/src/components/common/Arrow.tsx

import Link from 'next/link';

interface ArrowProps {
  direction?: 'right' | 'down' | 'left' | 'up';
  className?: string;
  href?: string;
}

const rotations = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
};

/**
 * Standard arrow icon. Rotates via CSS transform to support all four
 * directions. Wraps in a `Link` when `href` is provided.
 */
export function MenuArrowLarge({
  direction = 'right',
  className,
  href,
}: ArrowProps) {
  const svg = (
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

  if (href) {
    return (
      <Link href={href} prefetch={true}>
        {svg}
      </Link>
    );
  }

  return svg;
}

/**
 * Long arrow icon with a full-width shaft. Rotates via CSS transform to
 * support all four directions. Wraps in a `Link` when `href` is provided.
 */
export function LongArrow({ direction = 'down', className, href }: ArrowProps) {
  const svg = (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 69 61"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotations[direction]}deg)` }}
    >
      <path
        d="M33.5264 55.415L58.1844 30.5548L33.4187 5.69462L38.8258 2.11757e-06L69 30.554L38.9342 61L33.5264 55.415ZM-1.51752e-06 26.2833L62.1864 26.2833L62.1864 34.8256L-1.14412e-06 34.8256L-1.51752e-06 26.2833Z"
        fill="currentColor"
      />
    </svg>
  );

  if (href) {
    return (
      <Link href={href} prefetch={true}>
        {svg}
      </Link>
    );
  }

  return svg;
}

/**
 * Small 8×8 arrow icon used in menu contexts. Does not support rotation or
 * href — use `Arrow` for those needs.
 */
export function LinkArrowSmall({ className }: Pick<ArrowProps, 'className'>) {
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
