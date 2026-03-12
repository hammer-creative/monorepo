'use client';

import { Copyright } from '@/components/common';
import { LinkList } from '@/components/common/LinkList';
import { Wordmark } from '@/components/common/Wordmark';
import { Addresses, UtilitiesMenu } from '@/components/navigation';
import { RadixMenu } from '@/components/navigation/RadixMenu';
import { useNavigation } from '@/contexts/NavigationContext';
import type { NavigationData } from '@/types/navigation';
import { stagger, useAnimate } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

const ANIMATION = {
  overlay: {
    duration: 0.5,
    ease: 'easeOut' as const,
    easeIn: 'easeIn' as const,
  },
  items: {
    enter: {
      duration: 0.5,
      stagger: 0.05,
      ease: 'easeOut' as const,
      // y: { from: 50, to: 0 },
      opacity: { from: 0, to: 1 },
    },
    exit: {
      duration: 0.5,
      stagger: 0.03,
      ease: 'easeIn' as const,
      // y: { from: 0, to: 50 },
      opacity: { from: 1, to: 0 },
    },
  },
} as const;

interface MobileMenuProps {
  navigationData: NavigationData;
}

export function MobileMenu({ navigationData }: MobileMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, closeMenu } = useNavigation();

  const [scope, animate] = useAnimate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const primaryMenuMap = useRef<Map<string, HTMLElement>>(new Map());
  const wordmarkRef = useRef<HTMLDivElement>(null);

  const addressesRef = useRef<HTMLDivElement>(null);
  const utilitiesRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  const [clickedHref, setClickedHref] = useState<string | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  const isNavigatingRef = useRef(false);
  const targetPathnameRef = useRef<string | null>(null);

  const setItemRef = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      primaryMenuMap.current.set(id, element);
    } else {
      primaryMenuMap.current.delete(id);
    }
  }, []);

  const handleOpen = useCallback(async () => {
    if (!overlayRef.current) return;

    const radixItems = Array.from(primaryMenuMap.current.values());
    const secondarySections = [
      addressesRef.current,
      utilitiesRef.current,
      socialRef.current,
    ].filter(Boolean) as HTMLElement[];

    const allItems = [
      ...radixItems,
      ...secondarySections,
      wordmarkRef.current,
    ].filter(Boolean) as HTMLElement[];

    allItems.forEach((item) => {
      item.style.opacity = '0';
      // item.style.transform = `translateY(${ANIMATION.items.enter.y.from}px)`;
    });

    await animate(
      overlayRef.current,
      { scaleY: [0, 1] },
      {
        duration: ANIMATION.overlay.duration,
        ease: ANIMATION.overlay.ease,
      },
    );

    await animate(
      allItems,
      {
        // y: [ANIMATION.items.enter.y.from, ANIMATION.items.enter.y.to],
        opacity: [
          ANIMATION.items.enter.opacity.from,
          ANIMATION.items.enter.opacity.to,
        ],
      },
      {
        duration: ANIMATION.items.enter.duration,
        delay: stagger(ANIMATION.items.enter.stagger),
        ease: ANIMATION.items.enter.ease,
      },
    );
  }, [animate]);

  const exitItems = useCallback(
    async (clickedHref?: string | null) => {
      const radixItems = Array.from(primaryMenuMap.current.values());
      const secondarySections = [
        addressesRef.current,
        utilitiesRef.current,
        socialRef.current,
      ].filter(Boolean) as HTMLElement[];

      if (clickedHref) {
        const nonClickedRadixItems = radixItems.filter(
          (item) => !item.hasAttribute('data-clicked'),
        );
        const clickedItem = radixItems.find((item) =>
          item.hasAttribute('data-clicked'),
        );

        const nonClickedItems = [
          ...nonClickedRadixItems,
          ...secondarySections,
          wordmarkRef.current,
        ].filter(Boolean) as HTMLElement[];

        if (nonClickedItems.length > 0) {
          await animate(
            nonClickedItems,
            {
              // y: [ANIMATION.items.exit.y.from, ANIMATION.items.exit.y.to],
              opacity: [
                ANIMATION.items.exit.opacity.from,
                ANIMATION.items.exit.opacity.to,
              ],
            },
            {
              duration: ANIMATION.items.exit.duration,
              delay: stagger(ANIMATION.items.exit.stagger, { from: 'last' }),
              ease: ANIMATION.items.exit.ease,
            },
          );
        }

        if (clickedItem) {
          await animate(
            clickedItem,
            {
              // y: [ANIMATION.items.exit.y.from, ANIMATION.items.exit.y.to],
              opacity: [
                ANIMATION.items.exit.opacity.from,
                ANIMATION.items.exit.opacity.to,
              ],
            },
            {
              duration: ANIMATION.items.exit.duration,
              ease: ANIMATION.items.exit.ease,
            },
          );
        }
      } else {
        const allItems = [
          ...radixItems,
          ...secondarySections,
          wordmarkRef.current,
        ].filter(Boolean) as HTMLElement[];

        if (allItems.length > 0) {
          await animate(
            allItems,
            {
              // y: [ANIMATION.items.exit.y.from, ANIMATION.items.exit.y.to],
              opacity: [
                ANIMATION.items.exit.opacity.from,
                ANIMATION.items.exit.opacity.to,
              ],
            },
            {
              duration: ANIMATION.items.exit.duration,
              delay: stagger(ANIMATION.items.exit.stagger, { from: 'last' }),
              ease: ANIMATION.items.exit.ease,
            },
          );
        }
      }
    },
    [animate],
  );

  const exitOverlay = useCallback(async () => {
    if (!overlayRef.current) return;

    await animate(
      overlayRef.current,
      { scaleY: [1, 0] },
      {
        duration: ANIMATION.overlay.duration,
        ease: ANIMATION.overlay.easeIn,
      },
    );
  }, [animate]);

  useEffect(() => {
    if (isNavigatingRef.current) return;

    if (isOpen && !shouldRender) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          handleOpen();
        });
      });
    } else if (!isOpen && shouldRender) {
      const closeSequence = async () => {
        await exitItems();
        await exitOverlay();
        setShouldRender(false);
        setClickedHref(null);
      };
      closeSequence();
    }
  }, [isOpen, shouldRender, handleOpen, exitItems, exitOverlay]);

  const handleLinkClick = useCallback(
    async (href: string) => {
      if (isNavigatingRef.current) return;

      const isExternal = href.startsWith('http') || href.startsWith('//');
      const isMailto = href.startsWith('mailto:');

      if (isMailto) {
        window.location.href = href;
        setShouldRender(false);
        closeMenu();
        return;
      }

      if (isExternal) {
        window.open(href, '_blank', 'noopener,noreferrer');
        setShouldRender(false);
        closeMenu();
        return;
      }

      if (href === pathname) {
        closeMenu();
        return;
      }

      isNavigatingRef.current = true;
      setClickedHref(href);
      targetPathnameRef.current = href;

      await new Promise((resolve) => setTimeout(resolve, 0));

      await exitItems(href);

      router.push(href);
    },
    [exitItems, router, pathname, closeMenu],
  );

  useEffect(() => {
    if (!isNavigatingRef.current || !targetPathnameRef.current) return;

    if (pathname === targetPathnameRef.current) {
      const finish = async () => {
        await exitOverlay();
        setShouldRender(false);
        setClickedHref(null);
        closeMenu();
        isNavigatingRef.current = false;
        targetPathnameRef.current = null;
      };
      finish();
    }
  }, [pathname, exitOverlay, closeMenu]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeMenu]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        ref={overlayRef}
        className="menu-overlay"
        onClick={() => closeMenu()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeMenu();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close menu"
        style={{ transformOrigin: 'top' }}
      />

      <div ref={scope} className="mobile-menu is-open">
        <div className="footer-content">
          <RadixMenu
            items={navigationData.main}
            className="menu-primary"
            onLinkClick={handleLinkClick}
            clickedHref={clickedHref}
            setItemRef={setItemRef}
            showArrow
          />

          <div ref={addressesRef} className="menu-secondary addresses">
            <Addresses items={navigationData.addresses} />
          </div>
          <div ref={utilitiesRef} className="menu-secondary utilities">
            <UtilitiesMenu onLinkClick={handleLinkClick} />
          </div>
          <div ref={socialRef} className="menu-secondary social">
            <LinkList items={navigationData.social} />
            <Copyright />
          </div>
        </div>

        <div ref={wordmarkRef} className="wordmark">
          <Wordmark
            text={navigationData.wordmark.text}
            href={navigationData.wordmark.href}
          />
        </div>
      </div>
    </>
  );
}
