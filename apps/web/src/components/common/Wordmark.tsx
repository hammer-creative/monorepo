// apps/web/src/components/Common/Wordmark.tsx
import Link from 'next/link';

interface WordmarkProps {
  text: string;
  href: string;
}

export function Wordmark({ text, href }: WordmarkProps) {
  return (
    <Link href={href} className="wordmark">
      {text}
    </Link>
  );
}
