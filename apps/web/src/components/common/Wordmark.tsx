// apps/web/src/components/Common/Wordmark.tsx
import { ExtendedLink } from '@/components/common/ExtendedLink';

interface WordmarkProps {
  text?: string | null;
  href?: string | null;
  className?: string | null;
}

export function Wordmark({
  text = null,
  href = null,
  className = '',
}: WordmarkProps) {
  if (!text || !href) return null;

  return (
    <ExtendedLink href={href} className={className ?? ''}>
      <WordmarkSVG />
      <span className="sr-only">{text}</span>
    </ExtendedLink>
  );
}

export function WordmarkSVG() {
  return (
    <svg
      width="4973"
      height="669"
      viewBox="0 0 4973 669"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3717.47 669H4282.72V497.378H3910.21V418.443H4279.07V246.821H3910.21V171.622H4282.72V0H3717.47V669Z"
        fill="currentColor"
      />
      <path
        d="M4703.25 669H4973L4772.08 466.217C4867.53 438.713 4933.58 354.293 4933.58 245.947C4933.58 111.05 4829.86 0 4681.23 0H4322.46V669H4515.12V472.656H4534.83L4703.25 669ZM4515.12 171.622H4657.31C4701.34 171.622 4733.45 204.69 4733.45 248.729C4733.45 292.767 4701.34 324.882 4657.31 324.882H4515.12V171.622Z"
        fill="currentColor"
      />
      <path
        d="M884.601 0L666.193 669H876.494L913.611 555.168H1212.93L1250.05 669H1460.35L1242.1 0H884.601ZM969.723 383.626L1050.08 137.441H1076.62L1156.98 383.626H969.723Z"
        fill="currentColor"
      />
      <path
        d="M2119.15 0L2037.76 495.709H2015.75L1934.36 0H1598.4L1472.67 669H1673.59L1751.8 201.988H1776.2L1843.28 669H2210.23L2277.31 201.988H2301.71L2379.92 669H2580.84L2455.11 0H2119.15Z"
        fill="currentColor"
      />
      <path
        d="M3239.64 0L3158.26 495.709H3136.24L3054.93 0H2718.9L2593.16 669H2794.08L2872.29 201.988H2896.69L2963.77 669H3330.73L3397.81 201.988H3422.21L3500.41 669H3701.34L3575.6 0H3239.64Z"
        fill="currentColor"
      />
      <path
        d="M456.925 234.897H192.657V0H0V669H192.657V418.443H456.925V669H649.661V0H456.925V234.897Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WordmarkSVGGradient({
  enter,
  exit,
}: {
  enter: number;
  exit: number;
}) {
  const FALLOFF = 100;
  const PADDING = FALLOFF * 2 + 20;
  const WIDTH = 700;
  const TOTAL = WIDTH + PADDING * 2;

  const leadPos = -PADDING + (enter / 100) * TOTAL;
  const trailPos = -PADDING + (exit / 100) * TOTAL;

  const pct = (n: number) => `${(((n + PADDING) / TOTAL) * 100).toFixed(2)}%`;
  return (
    <svg
      viewBox={`-${PADDING} 0 ${TOTAL} 94`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hammerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={pct(trailPos)} stopColor="#141515" stopOpacity="0" />
          <stop
            offset={pct(Math.min(TOTAL, trailPos + FALLOFF))}
            stopColor="#778888"
          />
          <stop
            offset={pct(Math.min(TOTAL, trailPos + FALLOFF * 2))}
            stopColor="#FFCC98"
          />
          <stop offset={pct(leadPos)} stopColor="#FFCC98" />
          <stop
            offset={pct(Math.min(TOTAL, leadPos + FALLOFF))}
            stopColor="#778888"
          />
          <stop
            offset={pct(Math.min(TOTAL, leadPos + FALLOFF * 2))}
            stopColor="#141515"
            stopOpacity="0"
          />
        </linearGradient>
        <mask id="letterMask">
          <path
            d="M523.17 94H602.38V69.95H549.74V58.79H601.85V34.64H549.74V24.14H602.38V0H523.17V94Z"
            fill="white"
          />
          <path
            d="M661.87 94H698.72L672.8 65.6C686.1 61.67 695.06 49.82 695.06 34.62C695.06 15.63 680.47 0 659.69 0H608.38V94H635.51V66.47H638.3L661.87 94ZM635.51 24.14H656.02C662.2 24.14 666.63 28.77 666.63 34.99C666.63 41.21 662.2 45.69 656.02 45.69H635.51V24.14Z"
            fill="white"
          />
          <path
            d="M124.54 0L93.7 94H122.98L128.37 78.12H170.57L175.96 94H205.24L174.57 0H124.54ZM136.47 53.98L147.64 19.35L158.81 53.98H136.47Z"
            fill="white"
          />
          <path
            d="M298.17 0L286.8 69.74H283.87L272.5 0H224.99L207.15 94H236.07L246.98 28.4H250.16L259.14 94H310.59L319.57 28.4H322.74L333.65 94H362.58L344.73 0H298.17Z"
            fill="white"
          />
          <path
            d="M455.75 0L444.38 69.74H441.45L430.08 0H382.5L364.66 94H393.58L404.49 28.4H407.67L416.65 94H468.1L477.08 28.4H480.25L491.16 94H520.09L502.24 0H455.75Z"
            fill="white"
          />
          <path
            d="M64.29 33.04H27.09V0H0V94H27.09V58.79H64.29V94H91.38V0H64.29V33.04Z"
            fill="white"
          />
        </mask>
      </defs>
      <rect
        x={-PADDING}
        y="0"
        width={TOTAL}
        height="94"
        fill="url(#hammerGrad)"
        mask="url(#letterMask)"
      />
    </svg>
  );
}
