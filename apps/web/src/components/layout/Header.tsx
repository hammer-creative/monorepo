// apps/web/src/components/layout/Header.tsx
'use client';

import { Wordmark } from '@/components/common/Wordmark';
import { MenuToggle } from '@/components/navigation/MenuToggle';
import type { NavigationData } from '@/types/navigation';
import { usePathname } from 'next/navigation';

/**
 * Header Component
 *
 * Renders the main site header with conditional content based on current route.
 *
 * Behavior:
 * - On homepage ('/'): Shows only MenuToggle button
 * - On all other pages: Shows Wordmark + MenuToggle button
 *
 * The header uses pathname detection to determine whether to display the wordmark,
 * creating a cleaner visual hierarchy on the homepage where the wordmark may
 * appear elsewhere in the layout.
 *
 * @param navigationData - Navigation configuration object containing wordmark settings
 * @param navigationData.wordmark - Wordmark configuration (text, href)
 */
interface HeaderProps {
  navigationData: NavigationData;
}

export function Header({ navigationData }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <>
      {!isHome && (
        <Wordmark
          text={navigationData.wordmark.text}
          href={navigationData.wordmark.href}
          className="wordmark"
        />
      )}
      <MenuToggle />
    </>
  );
}
