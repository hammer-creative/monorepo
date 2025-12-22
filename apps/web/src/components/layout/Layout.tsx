// components/Layout.tsx
import { useNavigation } from '@/contexts/NavigationContext';
import navigationData from '@/data/navigation.json';
import type { NavigationData } from '@/types/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { useAnimate, stagger } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useRef } from 'react';
import { useState } from 'react';
import Headroom from 'react-headroom';

function Wordmark({ text, href }: { text: string; href: string }) {
  return (
    <a href={href} className="wordmark">
      {text}
    </a>
  );
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
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <circle cx="5" cy="5" r="5" fill="currentColor" />
      </svg>
      <span>{isOpen ? 'Less' : 'More'}</span>
    </button>
  );
}

function Header({ navigationData }: { navigationData: NavigationData }) {
  return (
    <div className="header-inner">
      <Wordmark
        text={navigationData.wordmark.text}
        href={navigationData.wordmark.href}
      />
      <MenuToggle />
    </div>
  );
}

function LinkList({
  items,
  onLinkClick,
}: {
  items: NavigationData['main'];
  onLinkClick: (href: string) => void;
}) {
  return (
    <nav>
      <ul className="mobile-menu-list">
        {items.map((item, i) => (
          <li key={i} className="mobile-menu-item">
            <a
              href={item.href}
              className="mobile-menu-link"
              onClick={(e) => {
                e.preventDefault();
                onLinkClick(item.href);
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Footer({ navigationData }: { navigationData: NavigationData }) {
  return <footer>{/* whatever */}</footer>;
}

function MobileMenu() {
  const router = useRouter();
  const { isOpen, closeMenu } = useNavigation();
  const [scope, animate] = useAnimate();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runAnimation = async () => {
      if (!overlayRef.current || !scope.current) return;

      if (isOpen) {
        // Open animation
        await animate(
          overlayRef.current,
          { scaleY: [0, 1] },
          { duration: 0.3, ease: 'easeOut' },
        );

        await animate(
          scope.current,
          { scaleY: [0, 1] },
          { duration: 0.3, ease: 'easeOut' },
        );

        await animate(
          '.mobile-menu-item',
          { y: [50, 0], opacity: [0, 1] },
          { duration: 0.3, delay: stagger(0.05), ease: 'easeOut' },
        );
      }
    };

    if (isOpen) {
      runAnimation();
    }
  }, [isOpen, animate]);

  const handleClose = async () => {
    if (!overlayRef.current || !scope.current) return;

    // Close animation
    await animate(
      '.mobile-menu-item',
      { y: [0, 50], opacity: [1, 0] },
      { duration: 0.2, delay: stagger(0.03, { from: 'last' }), ease: 'easeIn' },
    );

    await animate(
      scope.current,
      { scaleY: [1, 0] },
      { duration: 0.3, ease: 'easeIn' },
    );

    await animate(
      overlayRef.current,
      { scaleY: [1, 0] },
      { duration: 0.3, ease: 'easeIn' },
    );

    // Actually close after animation
    closeMenu();
  };

  const handleLinkClick = async (href: string) => {
    if (!overlayRef.current || !scope.current) return;

    router.prefetch(href);

    await animate(
      '.mobile-menu-item',
      { y: [0, 50], opacity: [1, 0] },
      { duration: 0.2, delay: stagger(0.03, { from: 'last' }), ease: 'easeIn' },
    );

    await animate(
      scope.current,
      { scaleY: [1, 0] },
      { duration: 0.3, ease: 'easeIn' },
    );

    await animate(
      overlayRef.current,
      { scaleY: [1, 0] },
      { duration: 0.3, ease: 'easeIn' },
    );

    router.push(href);
    closeMenu();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay ref={overlayRef} className="menu-overlay" />
        <Dialog.Content
          ref={scope}
          className="menu-content"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Navigation Menu</Dialog.Title>
          <LinkList
            items={(navigationData as NavigationData).main}
            onLinkClick={handleLinkClick}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
interface LayoutProps {
  children: ReactNode;
  pathname: string;
}

export function Layout({ children, pathname }: LayoutProps) {
  return (
    <>
      <Headroom tag="header" disableInlineStyles>
        <Header navigationData={navigationData as NavigationData} />
      </Headroom>

      <div id="wrapper" data-page={pathname}>
        <main>{children}</main>
        <Footer navigationData={navigationData as NavigationData} />
      </div>

      <MobileMenu />
    </>
  );
}
