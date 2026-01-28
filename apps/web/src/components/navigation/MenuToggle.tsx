// apps/web/src/components/navigation/MenuToggle.tsx
'use client';

import { useNavigation } from '@/contexts/NavigationContext';

/**
 * MenuToggle Button Component
 *
 * Renders the hamburger/close toggle button for mobile menu.
 * Consumes navigation state from NavigationContext to determine open/closed state.
 *
 * Visual States:
 * - Closed: Shows "More" text with dot indicator
 * - Open: Shows "Less" text with dot indicator (styled via .is-open class)
 *
 * Accessibility:
 * - aria-expanded reflects current menu state
 * - aria-label provides clear action description
 * - Visual dot marked aria-hidden (decorative only)
 */
export function MenuToggle() {
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
