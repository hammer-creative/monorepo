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
