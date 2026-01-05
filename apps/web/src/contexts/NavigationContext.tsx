// apps/web/src/contexts/NavigationContext.tsx
'use client';

import { NavigationContextState } from '@/types/navigation';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

// apps/web/src/contexts/NavigationContext.tsx

const NavigationContext = createContext<NavigationContextState | undefined>(
  undefined,
);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <NavigationContext.Provider
      value={{ isOpen, toggleMenu, closeMenu, openMenu }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
