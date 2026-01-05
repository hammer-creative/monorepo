// apps/web/src/app/template.tsx

'use client';

import { Layout } from '@/components/layout/Layout';
import { usePathname } from 'next/navigation';

// apps/web/src/app/template.tsx

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <Layout pathname={pathname ?? ''}>{children}</Layout>;
}
