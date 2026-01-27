// components/layout/Layout.tsx
'use client';

import { Wordmark } from '@/components/common/Wordmark';
import { Footer } from '@/components/layout';
import {
  Addresses,
  Copyright,
  SocialMenu,
  Utilities,
} from '@/components/navigation';
import { RadixMenu } from '@/components/navigation/RadixMenu';
import { useNavigation } from '@/contexts/NavigationContext';
import navigationData from '@/data/navigation.json';
import type { NavigationData } from '@/types/navigation';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  pathname: string;
}

function MenuToggle() {
  const { isOpen, toggleMenu } = useNavigation();

  return (
    <button
      className={`menu-toggle${isOpen ? ' is-open' : ''}`}
      onClick={toggleMenu}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <span className="menu-toggle-dot" aria-hidden="true">
        <svg width="5" height="5" viewBox="0 0 10 10">
          <circle cx="5" cy="5" r="5" fill="currentColor" />
        </svg>
      </span>

      <span className="menu-toggle-text">{isOpen ? 'Less' : 'More'}</span>
    </button>
  );
}

function Header({ navigationData }: { navigationData: NavigationData }) {
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

function MobileMenu() {
  const router = useRouter();
  const { isOpen, closeMenu } = useNavigation();

  return (
    <>
      {isOpen && (
        <div
          className="menu-overlay"
          onClick={closeMenu}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeMenu();
          }}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

      <div className={`mobile-menu${isOpen ? ' is-open' : ''}`}>
        <RadixMenu
          items={(navigationData as NavigationData).main}
          className="mobile-menu-primary"
          onLinkClick={(href) => {
            closeMenu();
            router.push(href);
          }}
        />
        <div className="mobile-menu-secondary">
          <div className="item group">
            <div className="addresses">
              <Addresses items={navigationData.addresses} />
            </div>
          </div>
          <div className="item utilities">
            <Utilities />
          </div>
          <div className="item social">
            <SocialMenu items={navigationData.social} />
            <Copyright />
          </div>
        </div>
        <div className="wordmark">
          <Wordmark
            text={navigationData.wordmark.text}
            href={navigationData.wordmark.href}
          />
        </div>
      </div>
    </>
  );
}

export function Layout({ children, pathname }: LayoutProps) {
  return (
    <div data-page={pathname}>
      <header>
        <Header navigationData={navigationData as NavigationData} />
      </header>

      <main>{children}</main>
      <Footer navigationData={navigationData as NavigationData} />

      <MobileMenu />
    </div>
  );
}
