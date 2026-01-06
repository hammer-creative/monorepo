// apps/web/src/components/navigation/Header.tsx
import { Wordmark } from '@/components/common';
import type { NavigationData } from '@/types/navigation';

import { MenuToggle } from './MenuToggle';

interface HeaderProps {
  navigationData: NavigationData;
}

export function Header({ navigationData }: HeaderProps) {
  return (
    <>
      <Wordmark
        text={navigationData.wordmark.text}
        href={navigationData.wordmark.href}
      />
      <MenuToggle />
    </>
  );
}
