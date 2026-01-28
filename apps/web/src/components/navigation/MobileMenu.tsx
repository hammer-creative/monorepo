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
      y: { from: 50, to: 0 },
      opacity: { from: 0, to: 1 },
    },
    exit: {
      duration: 0.5,
      stagger: 0.03,
      ease: 'easeIn' as const,
      y: { from: 0, to: 50 },
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
  const itemRefsRef = useRef<Map<string, HTMLElement>>(new Map());

  const [clickedHref, setClickedHref] = useState<string | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  const isNavigatingRef = useRef(false);
  const targetPathnameRef = useRef<string | null>(null);

  const setItemRef = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      itemRefsRef.current.set(id, element);
    } else {
      itemRefsRef.current.delete(id);
    }
  }, []);

  /**
   * OPEN: Overlay in → Items in
   */
  const handleOpen = useCallback(async () => {
    if (!overlayRef.current) return;

    const items = Array.from(itemRefsRef.current.values());

    // Set initial states
    items.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = `translateY(${ANIMATION.items.enter.y.from}px)`;
    });

    // Overlay in
    await animate(
      overlayRef.current,
      { scaleY: [0, 1] },
      {
        duration: ANIMATION.overlay.duration,
        ease: ANIMATION.overlay.ease,
      },
    );

    // Items in
    await animate(
      items,
      {
        y: [ANIMATION.items.enter.y.from, ANIMATION.items.enter.y.to],
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

  /**
   * Exit items only
   */
  const exitItems = useCallback(
    async (clickedHref?: string | null) => {
      const allItems = Array.from(itemRefsRef.current.values());

      if (clickedHref) {
        const nonClickedItems = allItems.filter(
          (item) => !item.hasAttribute('data-clicked'),
        );
        const clickedItem = allItems.find((item) =>
          item.hasAttribute('data-clicked'),
        );

        if (nonClickedItems.length > 0) {
          await animate(
            nonClickedItems,
            {
              y: [ANIMATION.items.exit.y.from, ANIMATION.items.exit.y.to],
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
              y: [ANIMATION.items.exit.y.from, ANIMATION.items.exit.y.to],
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
        if (allItems.length > 0) {
          await animate(
            allItems,
            {
              y: [ANIMATION.items.exit.y.from, ANIMATION.items.exit.y.to],
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

  /**
   * Exit overlay only
   */
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

  /**
   * Watch isOpen changes - but ignore if navigating
   */
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

  /*
   * Link click - exit items, navigate (overlay stays), wait for route load
   */
  const handleLinkClick = useCallback(
    async (href: string) => {
      if (isNavigatingRef.current) return;

      // If clicking current page, just close the menu normally
      if (href === pathname) {
        closeMenu();
        return;
      }

      isNavigatingRef.current = true;
      setClickedHref(href);
      targetPathnameRef.current = href;

      await new Promise((resolve) => setTimeout(resolve, 0));

      // Exit items
      await exitItems(href);

      // Navigate - overlay stays visible, route loads behind it
      router.push(href);

      // Pathname effect will handle overlay exit when route is ready
    },
    [exitItems, router, pathname, closeMenu],
  );

  /**
   * Route change complete - exit overlay
   */
  useEffect(() => {
    if (!isNavigatingRef.current || !targetPathnameRef.current) return;

    if (pathname === targetPathnameRef.current) {
      const finish = async () => {
        // Exit overlay
        await exitOverlay();

        // Cleanup
        setShouldRender(false);
        setClickedHref(null);
        closeMenu();
        isNavigatingRef.current = false;
        targetPathnameRef.current = null;
      };
      finish();
    }
  }, [pathname, exitOverlay, closeMenu]);

  /**
   * Escape key
   */
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
        <RadixMenu
          items={navigationData.main}
          className="mobile-menu-primary"
          onLinkClick={handleLinkClick}
          clickedHref={clickedHref}
          setItemRef={setItemRef}
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
