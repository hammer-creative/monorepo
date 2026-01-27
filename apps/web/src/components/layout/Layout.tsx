// components/layout/Layout.tsx
'use client';

import { Footer, Header } from '@/components/layout';
import { MobileMenu } from '@/components/navigation';
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
 * Root layout wrapper providing consistent page structure across the application.
 *
 * Structure:
 * - Header: Site header with wordmark and menu toggle
 * - Main: Page content area (children)
 * - Footer: Site footer with navigation
 * - MobileMenu: Off-canvas mobile navigation (rendered at root level)
 *
 * The layout uses data-page attribute for page-specific styling hooks.
 * Navigation state is managed via NavigationContext provider (should wrap this component).
 *
 * Navigation data is loaded once at the layout level and passed down to
 * Header, Footer, and MobileMenu to avoid redundant imports.
 *
 * @param children - Page content to render in main element
 * @param pathname - Current route pathname for page identification
 */
export function Layout({ children, pathname }: LayoutProps) {
  return (
    <div data-page={pathname}>
      <header>
        <Header navigationData={navigationData as NavigationData} />
      </header>

      <main>{children}</main>

      <Footer navigationData={navigationData as NavigationData} />

      <MobileMenu navigationData={navigationData as NavigationData} />
    </div>
  );
}
