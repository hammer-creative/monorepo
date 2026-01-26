// components/layout/Layout.tsx
import { Wordmark } from '@/components/common/Wordmark';
import { Footer } from '@/components/navigation/Footer';
import { useNavigation } from '@/contexts/NavigationContext';
import navigationData from '@/data/navigation.json';
import type { NavigationData } from '@/types/navigation';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  pathname: string;
}

function MenuToggle() {
  const { isOpen, toggleMenu } = useNavigation();

  return (
    <button
      className="menu-toggle"
      onClick={toggleMenu}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <span className="menu-toggle-dot">
        <svg width="5" height="5" viewBox="0 0 10 10" aria-hidden="true">
          <circle cx="5" cy="5" r="5" fill="currentColor" />
        </svg>
      </span>
      <span className="menu-toggle-text">{isOpen ? 'Less' : 'More'}</span>
    </button>
  );
}

function Header({ navigationData }: { navigationData: NavigationData }) {
  return (
    <>
      <Wordmark
        text={navigationData.wordmark.text}
        href={navigationData.wordmark.href}
        className="wordmark"
      />
      <MenuToggle />
    </>
  );
}

function MobileMenu() {
  const router = useRouter();
  const { isOpen, closeMenu } = useNavigation();

  if (!isOpen) return null;

  return (
    <>
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

      <div className="menu-content">
        <nav aria-label="Main navigation">
          <ul className="mobile-menu-list">
            {(navigationData as NavigationData).main.map((item, i) => (
              <li key={i} className="mobile-menu-item">
                <a
                  href={item.href}
                  className="mobile-menu-link"
                  onClick={(e) => {
                    e.preventDefault();
                    closeMenu();
                    router.push(item.href);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Footer navigationData={navigationData as NavigationData} />
      </div>
    </>
  );
}

export function Layout({ children, pathname }: LayoutProps) {
  return (
    <>
      <header>
        <Header navigationData={navigationData as NavigationData} />
      </header>
      <div id="wrapper" data-page={pathname}>
        <main>{children}</main>
        <Footer navigationData={navigationData as NavigationData} />
      </div>

      <MobileMenu />
    </>
  );
}
