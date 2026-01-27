// apps/web/src/components/navigation/MobileMenu.tsx
'use client';

import { Wordmark } from '@/components/common/Wordmark';
import {
  Addresses,
  Copyright,
  SocialMenu,
  Utilities,
} from '@/components/navigation';
import { RadixMenu } from '@/components/navigation/RadixMenu';
import { useNavigation } from '@/contexts/NavigationContext';
import type { NavigationData } from '@/types/navigation';
import { useRouter } from 'next/navigation';

/**
 * MobileMenu Component
 *
 * Renders the mobile navigation menu with overlay.
 * Visibility controlled by NavigationContext isOpen state.
 *
 * @param navigationData - Navigation configuration data
 */
interface MobileMenuProps {
  navigationData: NavigationData;
}

export function MobileMenu({ navigationData }: MobileMenuProps) {
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
          items={navigationData.main}
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
