// apps/web/src/app/template.tsx

'use client';

import { usePathname } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <Layout pathname={pathname ?? ''}>{children}</Layout>;
}
