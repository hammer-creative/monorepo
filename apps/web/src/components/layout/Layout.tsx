// components/layout/Layout.tsx
import { useNavigation } from '@/contexts/NavigationContext';
import navigationData from '@/data/navigation.json';
import type { NavigationData } from '@/types/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { stagger, useAnimate } from 'motion/react';
// apps/web/src/components/Common/Wordmark.tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';
import Headroom from 'react-headroom';

interface WordmarkProps {
  text?: string | null;
  href?: string | null;
  className?: string | null;
}

export function Wordmark({
  text = null,
  href = null,
  className = '',
}: WordmarkProps) {
  if (!text || !href) return null;

  return (
    <Link href={href} className={className ?? ''}>
      <WordmarkSVG />
      <span className="sr-only">{text}</span>
    </Link>
  );
}

export function WordmarkSVG() {
  return (
    <svg
      width="4973"
      height="669"
      viewBox="0 0 4973 669"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3717.47 669H4282.72V497.378H3910.21V418.443H4279.07V246.821H3910.21V171.622H4282.72V0H3717.47V669Z"
        fill="currentColor"
      />
      <path
        d="M4703.25 669H4973L4772.08 466.217C4867.53 438.713 4933.58 354.293 4933.58 245.947C4933.58 111.05 4829.86 0 4681.23 0H4322.46V669H4515.12V472.656H4534.83L4703.25 669ZM4515.12 171.622H4657.31C4701.34 171.622 4733.45 204.69 4733.45 248.729C4733.45 292.767 4701.34 324.882 4657.31 324.882H4515.12V171.622Z"
        fill="currentColor"
      />
      <path
        d="M884.601 0L666.193 669H876.494L913.611 555.168H1212.93L1250.05 669H1460.35L1242.1 0H884.601ZM969.723 383.626L1050.08 137.441H1076.62L1156.98 383.626H969.723Z"
        fill="currentColor"
      />
      <path
        d="M2119.15 0L2037.76 495.709H2015.75L1934.36 0H1598.4L1472.67 669H1673.59L1751.8 201.988H1776.2L1843.28 669H2210.23L2277.31 201.988H2301.71L2379.92 669H2580.84L2455.11 0H2119.15Z"
        fill="currentColor"
      />
      <path
        d="M3239.64 0L3158.26 495.709H3136.24L3054.93 0H2718.9L2593.16 669H2794.08L2872.29 201.988H2896.69L2963.77 669H3330.73L3397.81 201.988H3422.21L3500.41 669H3701.34L3575.6 0H3239.64Z"
        fill="currentColor"
      />
      <path
        d="M456.925 234.897H192.657V0H0V669H192.657V418.443H456.925V669H649.661V0H456.925V234.897Z"
        fill="currentColor"
      />
    </svg>
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

function LinkList({
  items,
  onLinkClick,
}: {
  items: NavigationData['main'];
  onLinkClick: (href: string) => void;
}) {
  const getEmailHref = () => {
    const user = 'info';
    const domain = 'hammercreative';
    const tld = 'com';
    return `mailto:${user}@${domain}.${tld}`;
  };

  return (
    <nav aria-label="Main navigation">
      <ul className="mobile-menu-list">
        {items.map((item, i) => {
          const isContact = item.id === 'contact';

          if (isContact) {
            return (
              <li key={i} className="mobile-menu-item">
                <a
                  href={getEmailHref()}
                  className="mobile-menu-link"
                  onClick={() => onLinkClick(getEmailHref())}
                  aria-label="Contact us via email"
                >
                  {item.label}
                </a>
              </li>
            );
          }

          if (!item?.href) return null;

          const isExternal = item.href.startsWith('http');

          if (isExternal) {
            return (
              <li key={i} className="mobile-menu-item">
                <a
                  href={item.href}
                  className="mobile-menu-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onLinkClick(item.href)}
                  aria-label={`${item.label} (opens in new window)`}
                >
                  {item.label}
                </a>
              </li>
            );
          }

          return (
            <li key={i} className="mobile-menu-item">
              <a
                href={item.href}
                className="mobile-menu-link"
                onClick={(e) => {
                  e.preventDefault();
                  onLinkClick(item.href);
                }}
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
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
    if (!isOpen) return;

    requestAnimationFrame(async () => {
      if (!overlayRef.current || !scope.current) return;

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
    });
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
          style={{ pointerEvents: 'none' }} // Don't catch clicks on the container
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
        {/* <Footer navigationData={navigationData as NavigationData} /> */}
      </div>

      <MobileMenu />
    </>
  );
}
