// components/layout/Layout.tsx
'use client';

import { Footer, Header } from '@/components/layout';
import navigationData from '@/data/navigation.json';
import type { NavigationData } from '@/types/navigation';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  pathname: string;
}

/**
 * Layout Component
 *
 * Root layout providing consistent page structure.
 *
 * Structure:
 * - Header: Wordmark (non-homepage) and menu toggle
 * - Main: Page content
 * - Footer: Navigation menus
 *
 * Navigation data is loaded once and passed to Header and Footer.
 * The data-page attribute enables page-specific CSS targeting.
 *
 * @param children - Page content
 * @param pathname - Current route for page identification
 */
export function Layout({ children, pathname }: LayoutProps) {
  return (
    <div data-page={pathname}>
      <div className="layout-container">
        <Header navigationData={navigationData as NavigationData} />
        <main>{children}</main>
        <Footer navigationData={navigationData as NavigationData} />
      </div>
    </div>
  );
}
