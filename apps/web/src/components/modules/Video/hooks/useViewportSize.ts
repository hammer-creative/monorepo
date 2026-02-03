// apps/web/src/components/modules/Video/hooks/useViewportSize.ts

import { useEffect, useState } from 'react';

import { VIDEO_CONFIG } from '../constants';

export function useViewportSize() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${VIDEO_CONFIG.MOBILE_BREAKPOINT})`,
    );

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return { isMobile };
}
