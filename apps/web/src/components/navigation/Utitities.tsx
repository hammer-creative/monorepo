// apps/web/src/components/navigation/Utilities.tsx
import Link from 'next/link';

export function Utilities() {
  return (
    <>
      <a href="mailto:info@hammercreative.com" className="link email">
        info@hammercreative.com
      </a>
      <Link href="/privacy" className="link privacy">
        Privacy Policy
      </Link>
    </>
  );
}
