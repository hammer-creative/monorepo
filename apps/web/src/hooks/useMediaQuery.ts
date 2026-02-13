// apps/web/src/hooks/useMediaQuery.ts
'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to track media query match state
 * @param query - Media query string (e.g., '(min-width: 50em)')
 * @returns boolean indicating if media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
